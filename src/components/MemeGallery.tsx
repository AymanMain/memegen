'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc, where, limit, startAfter, DocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { deleteFileFromImgur } from '@/lib/imgur';
import { Trash2, Edit, Share2, SortAsc, SortDesc } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ShareModal from './ShareModal';
import Image from 'next/image';

const ITEMS_PER_PAGE = 12;

export default function MemeGallery() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    memes,
    setMemes,
    addMeme,
    deleteMeme,
    setMemesLoading,
    setMemesError,
    memesLoading,
    memesError
  } = useStore();

  // Local state
  const [selectedMeme, setSelectedMeme] = useState<typeof memes[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'mine'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);

  // Fetch memes with pagination
  const fetchMemes = useCallback(async (isInitial = false) => {
    try {
      setMemesLoading(true);
      setMemesError(null);

      const memesRef = collection(db, 'memes');
      let q = query(memesRef);

      // Apply filters
      if (filter === 'mine' && user) {
        q = query(q, where('createdBy', '==', user.uid));
      }

      // Apply sorting
      q = query(q, orderBy('createdAt', sortBy === 'newest' ? 'desc' : 'asc'));

      // Apply pagination
      if (!isInitial && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      q = query(q, limit(ITEMS_PER_PAGE));

      const querySnapshot = await getDocs(q);
      
      // Update pagination state
      setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);

      const memesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        imageUrl: doc.data().imageUrl,
        deleteHash: doc.data().deleteHash,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        createdBy: doc.data().createdBy,
        textElements: doc.data().textElements,
        tags: doc.data().tags,
        likes: doc.data().likes,
        shares: doc.data().shares,
        isPublic: doc.data().isPublic,
      }));

      if (isInitial) {
        setMemes(memesData);
      } else {
        memesData.forEach(meme => addMeme(meme));
      }
    } catch (err) {
      console.error('Error fetching memes:', err);
      setMemesError('Erreur lors du chargement des mèmes');
    } finally {
      setMemesLoading(false);
    }
  }, [filter, sortBy, lastDoc, user, setMemes, addMeme, setMemesLoading, setMemesError]);

  // Initial fetch
  useEffect(() => {
    setLastDoc(null);
    fetchMemes(true);
  }, [filter, sortBy, fetchMemes]);

  // Load more
  const loadMore = () => {
    if (!hasMore || memesLoading) return;
    fetchMemes();
  };

  // Handle meme deletion
  const handleDelete = async (meme: typeof memes[0]) => {
    if (!user || meme.createdBy !== user.uid) return;

    try {
      // Delete from Imgur
      if (meme.deleteHash) {
        await deleteFileFromImgur(meme.deleteHash);
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'memes', meme.id));

      // Update store
      deleteMeme(meme.id);
    } catch (err) {
      console.error('Error deleting meme:', err);
      setMemesError('Erreur lors de la suppression du mème');
    }
  };

  // Handle meme edit
  const handleEdit = (meme: typeof memes[0]) => {
    router.push(`/editor?id=${meme.id}`);
  };

  // Handle meme share
  const handleShare = (meme: typeof memes[0]) => {
    setSelectedMeme(meme);
  };

  // Loading state
  if (memesLoading && memes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
      </div>
    );
  }

  // Error state
  if (memesError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
        {memesError}
      </div>
    );
  }

  // Empty state
  if (memes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Aucun mème trouvé
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {filter === 'mine' 
            ? 'Vous n\'avez pas encore créé de mème'
            : 'Commencez par créer votre premier mème !'
          }
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF8E8E] hover:to-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B]"
        >
          Créer un mème
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and sorting */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#FF6B6B] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Tous les mèmes
          </button>
          <button
            onClick={() => setFilter('mine')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'mine'
                ? 'bg-[#FF6B6B] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Mes mèmes
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('newest')}
            className={`p-2 rounded-lg transition-colors ${
              sortBy === 'newest'
                ? 'bg-[#FF6B6B] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title="Plus récents"
          >
            <SortDesc className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSortBy('oldest')}
            className={`p-2 rounded-lg transition-colors ${
              sortBy === 'oldest'
                ? 'bg-[#FF6B6B] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title="Plus anciens"
          >
            <SortAsc className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Memes grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {memes.map((meme) => (
          <div
            key={meme.id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden group relative"
          >
            {/* Meme Image */}
            <div className="aspect-square relative">
              <Image
                src={meme.imageUrl}
                alt={meme.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                priority={false}
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-4">
                {user && meme.createdBy === user.uid && (
                  <button
                    onClick={() => handleDelete(meme)}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                {user && meme.createdBy === user.uid && (
                  <button
                    onClick={() => handleEdit(meme)}
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                    title="Modifier"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleShare(meme)}
                  className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                  title="Partager"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Meme Info */}
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                {meme.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {new Date(meme.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {meme.tags && meme.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {meme.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={loadMore}
            disabled={memesLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF8E8E] hover:to-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {memesLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              'Charger plus'
            )}
          </button>
        </div>
      )}

      {/* Share modal */}
      {selectedMeme && (
        <ShareModal
          meme={selectedMeme}
          onClose={() => setSelectedMeme(null)}
          onDownload={async () => {
            // TODO: Implement download
            console.log('Download meme:', selectedMeme);
          }}
        />
      )}
    </div>
  );
} 