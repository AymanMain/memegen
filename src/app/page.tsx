'use client';

import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import { Sparkles, Image as ImageIcon, Edit, Share2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Background with gradient for both hero and upload sections */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#FF6B6B]/10 via-[#4ECDC4]/10 to-[#FFE66D]/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,230,109,0.2),rgba(255,107,107,0.1))]" />
          
          {/* Hero Section */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]">
                Créez vos Memes en quelques clics
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Un outil simple et puissant pour créer, partager et sauvegarder vos memes préférés
              </p>
            </div>
          </div>

          {/* Upload Section - Now in the middle with the same background */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="card p-8 max-w-3xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-center mb-8 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-[#FF6B6B] mr-2" />
                Commencez à créer
              </h2>
              <FileUpload />
            </div>
          </div>
        </div>

        {/* Features Section - Now at the bottom */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] flex items-center justify-center mb-4">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Simple</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Glissez-déposez vos images ou sélectionnez-les depuis votre appareil en quelques secondes.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4ECDC4] to-[#45B7AF] flex items-center justify-center mb-4">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Édition Intuitive</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ajoutez du texte, modifiez les couleurs et redimensionnez vos images avec une interface simple et intuitive.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFE66D] to-[#FFD93D] flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Partage Instantané</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Partagez vos créations sur les réseaux sociaux ou téléchargez-les en un clic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              Made with ❤️ by{' '}
              <a 
                href="https://github.com/AymanMain" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#FF6B6B] hover:text-[#FF8E8E] transition-colors"
              >
                Ayman EL KARROUSSI
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
