'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';
import { useStore } from '@/store/useStore';

export default function AuthPage() {
  const router = useRouter();
  const { user } = useStore();

  // Redirection si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenue sur Meme Generator
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Connectez-vous pour créer et sauvegarder vos mèmes
            </p>
          </div>
          <AuthForm />
        </div>
      </main>
    </div>
  );
} 