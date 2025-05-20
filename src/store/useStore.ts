import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User as FirebaseUser } from 'firebase/auth';

// Types
export interface User extends FirebaseUser {
  userId: string;
  username?: string;
}

export interface MemeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  deleteHash?: string;  // Imgur delete hash for image deletion
  createdAt: Date;
  createdBy: string;
}

export interface AppState {
  // État de l'utilisateur
  user: User | null;
  isAuthenticated: boolean;
  
  // État de l'upload
  uploadedImage: File | null;
  uploadProgress: number;
  uploadError: string | null;
  
  // État des templates
  templates: MemeTemplate[];
  selectedTemplate: MemeTemplate | null;
  
  // Actions
  setUser: (user: FirebaseUser | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUploadedImage: (file: File | null) => void;
  setUploadProgress: (progress: number) => void;
  setUploadError: (error: string | null) => void;
  setTemplates: (templates: MemeTemplate[]) => void;
  setSelectedTemplate: (template: MemeTemplate | null) => void;
  resetUploadState: () => void;
  clearStore: () => void;
}

// Création du store avec persistance
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // État initial
      user: null,
      isAuthenticated: false,
      uploadedImage: null,
      uploadProgress: 0,
      uploadError: null,
      templates: [],
      selectedTemplate: null,

      // Actions
      setUser: (user) =>
        set({
          user: user
            ? {
                ...user,
                userId: user.uid,
                username: user.displayName || undefined,
              }
            : null,
        }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setUploadedImage: (file) => set({ uploadedImage: file }),
      setUploadProgress: (progress) => set({ uploadProgress: progress }),
      setUploadError: (error) => set({ uploadError: error }),
      setTemplates: (templates) => set({ templates }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      resetUploadState: () => set({
        uploadedImage: null,
        uploadProgress: 0,
        uploadError: null,
      }),
      clearStore: () => set({ user: null, uploadedImage: null }),
    }),
    {
      name: 'meme-generator-storage', // Nom de la clé dans le localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // Ne persiste que l'état de l'utilisateur
    }
  )
); 