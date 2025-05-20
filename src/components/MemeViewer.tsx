'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Meme } from '@/models/meme';
import { toast } from 'react-hot-toast';
import ShareDialog from '@/components/ShareDialog';
import Image from 'next/image';

interface MemeViewerProps {
  id: string;
}

export default function MemeViewer({ id }: MemeViewerProps) {
  const [meme, setMeme] = useState<Meme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const memeDoc = await getDoc(doc(db, "memes", id));
        if (memeDoc.exists()) {
          const memeData = memeDoc.data() as Meme;
          setMeme(memeData);
          setLikes(memeData.likes || 0);

          // Increment view count
          await updateDoc(doc(db, "memes", id), {
            viewCount: (memeData.viewCount || 0) + 1
          });
        } else {
          toast.error("Meme not found");
        }
      } catch (error) {
        console.error("Error fetching meme:", error);
        toast.error("Failed to load meme");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeme();
  }, [id]);

  const handleLike = async () => {
    if (!meme) return;

    try {
      const newLikes = likes + 1;
      await updateDoc(doc(db, "memes", id), {
        likes: newLikes
      });
      setLikes(newLikes);
      toast.success("Liked!");
    } catch (error) {
      console.error("Error updating likes:", error);
      toast.error("Failed to update likes");
    }
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Meme not found</h1>
          <p className="text-gray-600">The meme you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Meme Image */}
          <div className="relative aspect-video">
            {meme.imageUrl && (
              <Image
                src={meme.imageUrl}
                alt={`Meme: ${meme.topText} ${meme.bottomText}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            )}
          </div>

          {/* Meme Text Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute text-center transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${meme.topTextPosition.x}%`,
                top: `${meme.topTextPosition.y}%`,
                color: meme.textStyle.textColor,
                fontSize: `${meme.textStyle.fontSize}px`,
                fontFamily: meme.textStyle.fontFamily,
                textShadow: `-${meme.textStyle.strokeWidth}px -${meme.textStyle.strokeWidth}px 0 ${meme.textStyle.strokeColor},
                            ${meme.textStyle.strokeWidth}px -${meme.textStyle.strokeWidth}px 0 ${meme.textStyle.strokeColor},
                            -${meme.textStyle.strokeWidth}px ${meme.textStyle.strokeWidth}px 0 ${meme.textStyle.strokeColor},
                            ${meme.textStyle.strokeWidth}px ${meme.textStyle.strokeWidth}px 0 ${meme.textStyle.strokeColor}`,
                textTransform: meme.textStyle.textTransform
              }}
            >
              {meme.topText}
            </div>
            <div
              className="absolute text-center transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${meme.bottomTextPosition.x}%`,
                top: `${meme.bottomTextPosition.y}%`,
                color: meme.textStyle.textColor,
                fontSize: `${meme.textStyle.fontSize}px`,
                fontFamily: meme.textStyle.fontFamily,
                textShadow: `-${meme.textStyle.strokeWidth}px -${meme.textStyle.strokeWidth}px 0 ${meme.textStyle.strokeColor},
                            ${meme.textStyle.strokeWidth}px -${meme.textStyle.strokeWidth}px 0 ${meme.textStyle.strokeColor},
                            -${meme.textStyle.strokeWidth}px ${meme.textStyle.strokeWidth}px 0 ${meme.textStyle.strokeColor},
                            ${meme.textStyle.strokeWidth}px ${meme.textStyle.strokeWidth}px 0 ${meme.textStyle.strokeColor}`,
                textTransform: meme.textStyle.textTransform
              }}
            >
              {meme.bottomText}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{likes}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        memeUrl={`/meme/${id}`}
        memeTitle={`${meme.topText} ${meme.bottomText}`.trim()}
      />
    </div>
  );
} 