'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.replace('/');
    } catch (err: unknown) {
      console.error('Auth error:', err);
      let errorMessage = 'Une erreur est survenue';
      
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/invalid-email':
            errorMessage = 'Adresse email invalide';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Ce compte a été désactivé';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Aucun compte trouvé avec cette adresse email';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Mot de passe incorrect';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'Cette adresse email est déjà utilisée';
            break;
          case 'auth/weak-password':
            errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
            break;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace('/');
    } catch (err: unknown) {
      console.error('Google sign-in error:', err);
      setError('Erreur lors de la connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-[#FF6B6B] focus:ring-[#FF6B6B] dark:focus:border-[#FF8E8E] dark:focus:ring-[#FF8E8E] backdrop-blur-sm"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:border-[#FF6B6B] focus:ring-[#FF6B6B] dark:focus:border-[#FF8E8E] dark:focus:ring-[#FF8E8E] backdrop-blur-sm"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] hover:from-[#FF8E8E] hover:to-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : isLogin ? (
            'Se connecter'
          ) : (
            'Créer un compte'
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400">
            Ou continuer avec
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B6B] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <Image src="/google-icon.svg" alt="Google" width={20} height={20} className="mr-2" />
        Google
      </button>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#FF6B6B] hover:text-[#FF8E8E] dark:text-[#FF8E8E] dark:hover:text-[#FF6B6B] font-medium transition-colors duration-200"
        >
          {isLogin
            ? "Pas encore de compte ? Créer un compte"
            : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
} 