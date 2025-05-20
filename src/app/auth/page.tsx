'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase';
import AuthForm from '@/components/AuthForm';

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] bg-clip-text text-transparent">
              Bienvenue sur TheFunnies
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Connectez-vous pour créer et partager vos mèmes
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
} 