'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Twitter, Facebook, Link as LinkIcon, Download } from 'lucide-react';
import { MemeTemplate } from '@/store/useStore';

interface ShareModalProps {
  meme: MemeTemplate;
  onClose: () => void;
  onDownload: () => Promise<void>;
}

export default function ShareModal({ meme, onClose, onDownload }: ShareModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const shareUrl = `${window.location.origin}/meme/${meme.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie du lien:', err);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = (platform: 'twitter' | 'facebook') => {
    const text = encodeURIComponent(`Découvrez ce mème créé avec Meme Generator !`);
    const url = encodeURIComponent(shareUrl);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Partager le mème</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Aperçu du mème */}
          <div className="mb-6 relative h-48">
            <Image
              src={meme.imageUrl}
              alt={meme.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          {/* Boutons de partage social */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span>Twitter</span>
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#4267B2] text-white rounded-lg hover:bg-[#365899] transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span>Facebook</span>
            </button>
          </div>

          {/* Copier le lien */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isCopied ? 'Copié !' : <LinkIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Télécharger */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download className="h-5 w-5" />
            <span>{isDownloading ? 'Téléchargement...' : 'Télécharger'}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 