import { useCallback } from 'react';
import { Type, Palette, Maximize2, Trash2 } from 'lucide-react';

interface TextControlsProps {
  selectedElement: {
    id: string;
    text: string;
    fontSize: number;
    fontFamily: string;
    fill: string;
  } | null;
  onUpdate: (updates: {
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
  }) => void;
  onDelete: () => void;
}

const FONT_FAMILIES = [
  'Arial',
  'Verdana',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Comic Sans MS',
];

const FONT_SIZES = [12, 16, 20, 24, 32, 48, 64, 72];

const COLORS = [
  '#000000',
  '#FFFFFF',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
];

export default function TextControls({
  selectedElement,
  onUpdate,
  onDelete,
}: TextControlsProps) {
  const handleFontFamilyChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onUpdate({ fontFamily: e.target.value });
    },
    [onUpdate]
  );

  const handleFontSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onUpdate({ fontSize: parseInt(e.target.value) });
    },
    [onUpdate]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      onUpdate({ fill: color });
    },
    [onUpdate]
  );

  if (!selectedElement) {
    return null;
  }

  return (
    <div className="bg-white p-4 border-b space-y-4">
      <div className="flex items-center space-x-4">
        {/* Famille de police */}
        <div className="flex items-center space-x-2">
          <Type className="h-5 w-5 text-gray-500" />
          <select
            value={selectedElement.fontFamily}
            onChange={handleFontFamilyChange}
            className="border rounded px-2 py-1 text-sm"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Taille de police */}
        <div className="flex items-center space-x-2">
          <Maximize2 className="h-5 w-5 text-gray-500" />
          <select
            value={selectedElement.fontSize}
            onChange={handleFontSizeChange}
            className="border rounded px-2 py-1 text-sm"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        {/* Couleur */}
        <div className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-gray-500" />
          <div className="flex space-x-1">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-6 h-6 rounded-full border ${
                  selectedElement.fill === color
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : ''
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Bouton de suppression */}
        <button
          onClick={onDelete}
          className="ml-auto flex items-center text-red-500 hover:text-red-700"
          title="Supprimer le texte"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 