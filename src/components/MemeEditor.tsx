'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useRouter } from 'next/navigation';
import { useStore, UploadedImage } from '@/store/useStore';
import { Download, Save, Share2, Type, Image as ImageIcon, X, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import TextControls from './TextControls';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadFileToImgur } from '@/lib/imgur';
import useImage from 'use-image';

// Types pour les éléments de texte
interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  draggable: boolean;
  isSelected: boolean;
}

interface ImageSize {
  width: number;
  height: number;
  x: number;
  y: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  memeUrl: string;
  onDownload: () => void;
}

function ShareModal({ isOpen, onClose, memeUrl, onDownload }: ShareModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(memeUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie du lien:', err);
    }
  };

  const handleShare = (platform: 'twitter' | 'facebook') => {
    const text = encodeURIComponent(`Découvrez ce mème créé avec Meme Generator !`);
    const url = encodeURIComponent(memeUrl);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Partager votre mème</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Social share buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleShare('twitter')}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span>Twitter</span>
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#4267B2] text-white rounded-lg hover:bg-[#365899] transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span>Facebook</span>
            </button>
          </div>

          {/* Copy link */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={memeUrl}
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

          {/* Download button */}
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Télécharger</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MemeEditor() {
  const { uploadedImage } = useStore();
  const [image, status] = useImage(uploadedImage ? `/api/proxy?url=${encodeURIComponent(uploadedImage.url)}` : '');
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize>({ 
    width: CANVAS_WIDTH, 
    height: CANVAS_HEIGHT,
    x: 0,
    y: 0
  });
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const router = useRouter();
  const { user } = useStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Calculate image size to fit canvas while maintaining aspect ratio
  useEffect(() => {
    if (image) {
      const imageAspectRatio = image.width / image.height;
      const canvasAspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
      let width, height;

      // Always scale to fit the smaller dimension
      if (imageAspectRatio > canvasAspectRatio) {
        // Image is wider than canvas - fit to height
        height = CANVAS_HEIGHT;
        width = height * imageAspectRatio;
      } else {
        // Image is taller than canvas - fit to width
        width = CANVAS_WIDTH;
        height = width / imageAspectRatio;
      }

      // Center the image
      const x = (CANVAS_WIDTH - width) / 2;
      const y = (CANVAS_HEIGHT - height) / 2;

      setImageSize({ width, height, x, y });
    }
  }, [image]);

  // Handle stage click to deselect text
  const handleStageClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      setTextElements((elements) =>
        elements.map((el) => ({ ...el, isSelected: false }))
      );
      if (transformerRef.current) {
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, []);

  // Gestion de la sélection des éléments
  const handleSelect = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      setTextElements((elements) =>
        elements.map((el) => ({ ...el, isSelected: false }))
      );
      return;
    }

    const clickedOnText = e.target.getType() === 'Text';
    if (clickedOnText) {
      const id = e.target.id();
      setSelectedId(id);
      setTextElements((elements) =>
        elements.map((el) => ({
          ...el,
          isSelected: el.id === id,
        }))
      );
    }
  }, []);

  // Ajout d'un nouveau texte
  const addText = useCallback(() => {
    const newText: TextElement = {
      id: Date.now().toString(),
      text: 'Double-cliquez pour éditer',
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#000000',
      draggable: true,
      isSelected: true,
    };

    setTextElements((elements) => [
      ...elements.map((el) => ({ ...el, isSelected: false })),
      newText,
    ]);
    setSelectedId(newText.id);
  }, []);

  // Mise à jour du texte
  const updateText = useCallback((id: string, newText: string) => {
    setTextElements((elements) =>
      elements.map((el) =>
        el.id === id ? { ...el, text: newText } : el
      )
    );
  }, []);

  // Mise à jour des propriétés du texte
  const updateTextProperties = useCallback(
    (updates: { fontSize?: number; fontFamily?: string; fill?: string }) => {
      if (!selectedId) return;

      setTextElements((elements) =>
        elements.map((el) =>
          el.id === selectedId ? { ...el, ...updates } : el
        )
      );
    },
    [selectedId]
  );

  // Suppression d'un élément de texte
  const deleteSelectedText = useCallback(() => {
    if (!selectedId) return;

    setTextElements((elements) =>
      elements.filter((el) => el.id !== selectedId)
    );
    setSelectedId(null);
  }, [selectedId]);

  // Gestion du redimensionnement
  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const selectedNode = stageRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  // Téléchargement du mème
  const handleDownload = useCallback(() => {
    if (!stageRef.current || !image) {
      setError('Impossible de télécharger le mème. Veuillez réessayer.');
      return;
    }

    try {
      // Get the stage data URL with proper dimensions
      const dataURL = stageRef.current.toDataURL({
        pixelRatio: 2, // Higher quality
        mimeType: 'image/png',
        quality: 1,
        width: imageSize.width,
        height: imageSize.height,
        x: imageSize.x,
        y: imageSize.y,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `meme-${Date.now()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      setError('Erreur lors du téléchargement. Veuillez réessayer.');
    }
  }, [image, imageSize]);

  // Sauvegarde du mème
  const handleSave = useCallback(async () => {
    if (!stageRef.current || !user || !image) {
      setError('Impossible de sauvegarder le mème. Veuillez réessayer.');
      return;
    }

    try {
      // Get the stage data URL with proper dimensions
      const dataURL = stageRef.current.toDataURL({
        pixelRatio: 2,
        mimeType: 'image/png',
        quality: 1,
        width: imageSize.width,
        height: imageSize.height,
        x: imageSize.x,
        y: imageSize.y,
      });

      // Convert data URL to blob
      const response = await fetch(dataURL);
      const blob = await response.blob();

      // Générer un nom unique pour le mème
      const memeId = Date.now().toString();
      const memeName = `Mème ${new Date().toLocaleDateString('fr-FR')}`;

      // Upload de l'image dans Imgur
      const { url: imageUrl, deleteHash, error: uploadError } = await uploadFileToImgur(
        blob,
        memeName
      );

      if (uploadError) {
        throw uploadError;
      }

      // Sauvegarder les métadonnées dans Firestore
      const memeData = {
        name: memeName,
        imageUrl,
        deleteHash,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        textElements: textElements.map(({ id, ...element }) => element), // Exclure l'ID local
      };

      await addDoc(collection(db, 'memes'), memeData);

      // Redirection vers la galerie
      router.push('/gallery');
    } catch (err) {
      console.error('Save error:', err);
      setError('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  }, [stageRef, user, image, imageSize, textElements, router]);

  // Partage du mème
  const handleShare = useCallback(async () => {
    if (!stageRef.current || !image) {
      setError('Impossible de partager le mème. Veuillez réessayer.');
      return;
    }

    try {
      // Get the stage data URL
      const dataURL = stageRef.current.toDataURL({
        pixelRatio: 2,
        mimeType: 'image/png',
        quality: 1,
        width: imageSize.width,
        height: imageSize.height,
        x: imageSize.x,
        y: imageSize.y,
      });

      // Convert to blob
      const response = await fetch(dataURL);
      const blob = await response.blob();

      // Upload to Imgur for sharing
      const { url: imageUrl, error: uploadError } = await uploadFileToImgur(
        blob,
        `Mème ${new Date().toLocaleDateString('fr-FR')}`
      );

      if (uploadError) {
        throw uploadError;
      }

      // Try to use Web Share API first
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Mon mème créé avec Meme Generator',
            text: 'Découvrez ce mème que j\'ai créé !',
            url: imageUrl,
          });
          return;
        } catch (err) {
          // If Web Share API fails, fall back to custom share modal
          console.log('Web Share API failed, falling back to custom share modal');
        }
      }

      // Fall back to custom share modal
      setShareUrl(imageUrl);
      setIsShareModalOpen(true);
    } catch (err) {
      console.error('Share error:', err);
      setError('Erreur lors du partage. Veuillez réessayer.');
    }
  }, [image, imageSize]);

  // Récupération de l'élément sélectionné
  const selectedElement = textElements.find((el) => el.id === selectedId) || null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-4 mt-4" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Loading state */}
      {status === 'loading' && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
        </div>
      )}

      {/* Fixed toolbar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={addText}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] text-white rounded-lg hover:from-[#FF8E8E] hover:to-[#FF6B6B] transition-all duration-200 shadow-sm"
            >
              <Type className="h-5 w-5 mr-2" />
              Ajouter du texte
            </button>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-[#4ECDC4] to-[#45B7AF] text-white rounded-lg hover:from-[#45B7AF] hover:to-[#4ECDC4] transition-all duration-200 shadow-sm"
            >
              <Save className="h-5 w-5 mr-2" />
              Sauvegarder
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-600 transition-all duration-200 shadow-sm"
            >
              <Download className="h-5 w-5 mr-2" />
              Télécharger
            </button>
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-[#FFD93D] to-[#FFC107] text-white rounded-lg hover:from-[#FFC107] hover:to-[#FFD93D] transition-all duration-200 shadow-sm"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Partager
            </button>
          </div>
        </div>
      </div>

      {/* Text controls */}
      <div className="sticky top-[73px] z-40 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        <TextControls
          selectedElement={selectedElement}
          onUpdate={updateTextProperties}
          onDelete={deleteSelectedText}
        />
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full p-4">
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl shadow-xl p-4 mx-auto max-w-4xl">
            {image ? (
              <div className="relative w-full" style={{ maxWidth: CANVAS_WIDTH, margin: '0 auto' }}>
                <div className="relative" style={{ paddingBottom: `${(CANVAS_HEIGHT / CANVAS_WIDTH) * 100}%` }}>
                  <div className="absolute inset-0 overflow-visible">
                    <Stage
                      ref={stageRef}
                      width={CANVAS_WIDTH}
                      height={CANVAS_HEIGHT}
                      onMouseDown={handleStageClick}
                      className="absolute inset-0 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
                      style={{ width: '100%', height: '100%' }}
                    >
                      <Layer>
                        {/* Background image */}
                        <KonvaImage
                          image={image}
                          width={imageSize.width}
                          height={imageSize.height}
                          x={imageSize.x}
                          y={imageSize.y}
                        />

                        {/* Text elements */}
                        {textElements.map((textElement) => (
                          <Text
                            key={textElement.id}
                            id={textElement.id}
                            text={textElement.text}
                            x={textElement.x}
                            y={textElement.y}
                            fontSize={textElement.fontSize}
                            fontFamily={textElement.fontFamily}
                            fill={textElement.fill}
                            draggable={textElement.draggable}
                            onDblClick={() => {
                              const newText = prompt('Entrez votre texte:', textElement.text);
                              if (newText) {
                                updateText(textElement.id, newText);
                              }
                            }}
                            onDragEnd={(e) => {
                              setTextElements((elements) =>
                                elements.map((el) =>
                                  el.id === textElement.id
                                    ? { ...el, x: e.target.x(), y: e.target.y() }
                                    : el
                                )
                              );
                            }}
                          />
                        ))}

                        {/* Transformer */}
                        <Transformer
                          ref={transformerRef}
                          boundBoxFunc={(oldBox, newBox) => {
                            // Limit the size of the text box
                            const minSize = 20;
                            if (newBox.width < minSize || newBox.height < minSize) {
                              return oldBox;
                            }
                            return newBox;
                          }}
                        />
                      </Layer>
                    </Stage>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <ImageIcon className="h-16 w-16 mb-4" />
                <p>Aucune image sélectionnée</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        memeUrl={shareUrl}
        onDownload={handleDownload}
      />
    </div>
  );
} 