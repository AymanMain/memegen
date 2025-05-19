'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase';
import { Sparkles, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  return (
    <nav className="relative z-10 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]">
              MemeGen
            </span>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => router.push('/editor')}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] rounded-lg hover:from-[#FF5252] hover:to-[#FF6B6B] transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  Créer un Meme
                </button>
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4ECDC4] to-[#45B7AF] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.email}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="py-1">
                      <button
                        onClick={signOut}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => router.push('/auth')}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] rounded-lg hover:from-[#FF5252] hover:to-[#FF6B6B] transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 