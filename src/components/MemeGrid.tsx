'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Download, Share2, Trash2, Edit2 } from 'lucide-react';
import { MemeTemplate } from '@/store/useStore';
import ShareModal from './ShareModal';

interface MemeGridProps {
  memes: MemeTemplate[];
  onDelete: (id: string) => Promise<void>;
  onShare: (id: string) => Promise<void>;
  onDownload: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export default function MemeGrid({
  memes,
  onDelete,
  onShare,
  onDownload,
  isLoading = false,
}: MemeGridProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedMeme, setSelectedMeme] = useState<MemeTemplate | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleShare = (meme: MemeTemplate) => {
    setSelectedMeme(meme);
  };

  const handleDownload = async (id: string) => {
    try {
      await onDownload(id);
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/editor?id=${id}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg animate-pulse aspect-square"
          />
        ))}
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Aucun mème sauvegardé pour le moment
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {memes.map((meme) => (
          <div
            key={meme.id}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Image du mème */}
            <div className="aspect-square relative">
              <Image
                src={meme.imageUrl}
                alt={meme.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Overlay avec les actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(meme.id)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Modifier"
                >
                  <Edit2 className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => handleShare(meme)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Partager"
                >
                  <Share2 className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => handleDelete(meme.id)}
                  disabled={deletingId === meme.id}
                  className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors disabled:opacity-50"
                  title="Supprimer"
                >
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>

            {/* Informations du mème */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">{meme.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(meme.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de partage */}
      {selectedMeme && (
        <ShareModal
          meme={selectedMeme}
          onClose={() => setSelectedMeme(null)}
          onDownload={() => handleDownload(selectedMeme.id)}
        />
      )}
    </>
  );
} 