'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DynamicMemeEditor from '@/components/DynamicMemeEditor';
import { useStore } from '@/store/useStore';

export default function EditorPage() {
  const router = useRouter();
  const { uploadedImage } = useStore();

  // Redirection si aucune image n'est sélectionnée
  useEffect(() => {
    if (!uploadedImage) {
      router.push('/');
    }
  }, [uploadedImage, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b">
              <h1 className="text-2xl font-bold text-gray-900">
                Éditeur de Mème
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Personnalisez votre mème en ajoutant du texte et en ajustant sa position
              </p>
            </div>
            <div className="flex-1 overflow-auto">
              <DynamicMemeEditor />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
} 