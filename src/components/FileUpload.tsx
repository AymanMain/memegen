'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { uploadFileToSupabase } from '@/lib/supabase';
import { useAuth } from '@/lib/firebase';

export default function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      setError('Veuillez vous connecter pour uploader des fichiers');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez uploader une image valide (PNG, JPG, GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const { url, error: uploadError } = await uploadFileToSupabase(
        file,
        'memes',
        user.uid
      );

      if (uploadError) {
        throw uploadError;
      }

      // Redirect to editor with the uploaded image URL
      router.push(`/editor?image=${encodeURIComponent(url)}`);
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de l\'upload'
      );
    } finally {
      setIsUploading(false);
    }
  }, [user, router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    disabled: isUploading || !user
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-[#4ECDC4] bg-[#4ECDC4]/10' 
            : 'border-gray-300 dark:border-gray-700 hover:border-[#FF6B6B] dark:hover:border-[#FF6B6B]'
          }
          ${!user ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="flex justify-center">
            {isUploading ? (
              <div className="w-12 h-12 rounded-full border-4 border-[#FF6B6B] border-t-transparent animate-spin" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] flex items-center justify-center">
                {isDragActive ? (
                  <Upload className="w-6 h-6 text-white" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-white" />
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {!user 
                ? 'Connectez-vous pour créer un meme'
                : isUploading 
                  ? 'Upload en cours...'
                  : isDragActive 
                    ? 'Déposez votre image ici'
                    : 'Glissez-déposez une image ou cliquez pour sélectionner'
              }
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF jusqu'à 5MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
} 