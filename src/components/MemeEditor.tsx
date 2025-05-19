'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image, Text, Transformer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Download, Save, Share2, Type, Image as ImageIcon } from 'lucide-react';
import TextControls from './TextControls';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadFile, getPublicUrl } from '@/lib/supabase';

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

export default function MemeEditor() {
  const { uploadedImage } = useStore();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const router = useRouter();
  const { user } = useStore();

  // Chargement de l'image
  useEffect(() => {
    if (uploadedImage) {
      const img = new window.Image();
      img.src = URL.createObjectURL(uploadedImage);
      img.onload = () => {
        setImage(img);
      };
    }
  }, [uploadedImage]);

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
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = 'mon-meme.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  // Sauvegarde du mème
  const handleSave = useCallback(async () => {
    if (!stageRef.current || !user) return;

    try {
      // Convertir le stage en image
      const dataURL = stageRef.current.toDataURL();
      
      // Convertir le dataURL en Blob
      const response = await fetch(dataURL);
      const blob = await response.blob();

      // Générer un nom unique pour le mème
      const memeId = Date.now().toString();
      const memeName = `Mème ${new Date().toLocaleDateString('fr-FR')}`;
      const filePath = `${user.uid}/${memeId}`;

      // Upload de l'image dans Supabase Storage
      await uploadFile(blob, filePath);
      const imageUrl = getPublicUrl(filePath);

      // Sauvegarder les métadonnées dans Firestore
      const memeData = {
        name: memeName,
        imageUrl,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        textElements: textElements.map(({ id, ...element }) => element), // Exclure l'ID local
      };

      await addDoc(collection(db, 'memes'), memeData);

      // Redirection vers la galerie
      router.push('/gallery');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du mème:', err);
      alert('Impossible de sauvegarder le mème. Veuillez réessayer.');
    }
  }, [stageRef, user, textElements, router]);

  // Partage du mème
  const handleShare = useCallback(async () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();
      // TODO: Implémenter le partage
      console.log('Partage du mème...', dataURL);
    }
  }, []);

  // Récupération de l'élément sélectionné
  const selectedElement = textElements.find((el) => el.id === selectedId) || null;

  return (
    <div className="flex flex-col h-full">
      {/* Barre d'outils */}
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            onClick={addText}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Type className="h-5 w-5 mr-2" />
            Ajouter du texte
          </button>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Save className="h-5 w-5 mr-2" />
            Sauvegarder
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            <Download className="h-5 w-5 mr-2" />
            Télécharger
          </button>
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Partager
          </button>
        </div>
      </div>

      {/* Contrôles de texte */}
      <TextControls
        selectedElement={selectedElement}
        onUpdate={updateTextProperties}
        onDelete={deleteSelectedText}
      />

      {/* Zone d'édition */}
      <div className="flex-1 bg-gray-100 p-4 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 mx-auto" style={{ maxWidth: '800px' }}>
          {image ? (
            <Stage
              ref={stageRef}
              width={image.width}
              height={image.height}
              onMouseDown={handleSelect}
              className="mx-auto"
            >
              <Layer>
                {/* Image de fond */}
                <Image
                  image={image}
                  width={image.width}
                  height={image.height}
                />

                {/* Éléments de texte */}
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

                {/* Transformer pour le redimensionnement */}
                <Transformer ref={transformerRef} />
              </Layer>
            </Stage>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <ImageIcon className="h-16 w-16 mb-4" />
              <p>Aucune image sélectionnée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 