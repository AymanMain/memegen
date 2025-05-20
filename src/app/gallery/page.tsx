'use client';

import { useAuth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MemeGallery from '@/components/MemeGallery';
import { Plus } from 'lucide-react';

export default function GalleryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Ma Galerie de Mèmes
            </h1>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF8E8E] hover:to-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B]"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouveau Mème
            </button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MemeGallery />
      </div>
    </div>
  );
} 