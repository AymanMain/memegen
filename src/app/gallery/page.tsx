'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Navbar from '@/components/Navbar';
import MemeGrid from '@/components/MemeGrid';
import { MemeTemplate } from '@/store/useStore';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { deleteFileFromImgur } from '@/lib/imgur';

export default function GalleryPage() {
  const router = useRouter();
  const { user } = useStore();
  const [memes, setMemes] = useState<MemeTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirection si non connecté
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  // Chargement des mèmes
  useEffect(() => {
    const fetchMemes = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        const memesRef = collection(db, 'memes');
        const q = query(memesRef, where('createdBy', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const memesList: MemeTemplate[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          memesList.push({
            id: doc.id,
            name: data.name,
            imageUrl: data.imageUrl,
            createdAt: data.createdAt.toDate(),
            createdBy: data.createdBy,
          });
        });

        // Tri par date de création (plus récent en premier)
        memesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setMemes(memesList);
      } catch (err) {
        console.error('Erreur lors du chargement des mèmes:', err);
        setError('Impossible de charger vos mèmes. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemes();
  }, [user]);

  // Suppression d'un mème
  const handleDelete = async (id: string) => {
    if (!user) return;

    try {
      // Récupérer les informations du mème
      const memeToDelete = memes.find((m) => m.id === id);
      if (!memeToDelete) return;

      // Extraire le deleteHash de l'URL Imgur (stocké dans Firestore)
      const deleteHash = memeToDelete.deleteHash;
      if (deleteHash) {
        await deleteFileFromImgur(deleteHash);
      }

      // Supprimer le document de la base de données
      await deleteDoc(doc(db, 'memes', id));

      // Mettre à jour l'état local
      setMemes((currentMemes) => currentMemes.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du mème:', err);
      setError('Impossible de supprimer le mème. Veuillez réessayer.');
    }
  };

  // Partage d'un mème
  const handleShare = async (id: string) => {
    try {
      const memeToShare = memes.find((m) => m.id === id);
      if (!memeToShare) return;

      // TODO: Implémenter le partage (copier le lien, partage social, etc.)
      await navigator.clipboard.writeText(
        `${window.location.origin}/meme/${id}`
      );
      alert('Lien copié dans le presse-papiers !');
    } catch (err) {
      console.error('Erreur lors du partage du mème:', err);
      setError('Impossible de partager le mème. Veuillez réessayer.');
    }
  };

  // Téléchargement d'un mème
  const handleDownload = async (id: string) => {
    try {
      const memeToDownload = memes.find((m) => m.id === id);
      if (!memeToDownload) return;

      // Récupérer l'image
      const response = await fetch(memeToDownload.imageUrl);
      const blob = await response.blob();

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${memeToDownload.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur lors du téléchargement du mème:', err);
      setError('Impossible de télécharger le mème. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Ma Galerie</h1>
            <p className="mt-2 text-sm text-gray-600">
              Gérez vos mèmes créés et sauvegardés
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-md">
              {error}
            </div>
          )}

          <MemeGrid
            memes={memes}
            onDelete={handleDelete}
            onShare={handleShare}
            onDownload={handleDownload}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
} 