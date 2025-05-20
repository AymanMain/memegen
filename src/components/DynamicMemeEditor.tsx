'use client';

import dynamic from 'next/dynamic';

// Import dynamique de MemeEditor avec désactivation du SSR
const MemeEditor = dynamic(() => import('./MemeEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-500">Chargement de l&apos;éditeur...</div>
    </div>
  ),
});

export default function DynamicMemeEditor() {
  return <MemeEditor />;
} 