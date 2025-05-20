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
  textElements?: Array<{
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    fill: string;
  }>;
  likes?: number;
  shares?: number;
  tags?: string[];
  isPublic?: boolean;
}

export interface UploadedImage {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

export interface AppState {
  // État de l'utilisateur
  user: User | null;
  isAuthenticated: boolean;
  
  // État de l'upload
  uploadedImage: UploadedImage | null;
  uploadProgress: number;
  uploadError: string | null;
  
  // État des templates
  memes: MemeTemplate[];
  selectedMeme: MemeTemplate | null;
  memesLoading: boolean;
  memesError: string | null;
  
  // Actions
  setUser: (user: FirebaseUser | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUploadedImage: (image: UploadedImage | null) => void;
  setUploadProgress: (progress: number) => void;
  setUploadError: (error: string | null) => void;
  
  // Meme actions
  setMemes: (memes: MemeTemplate[]) => void;
  addMeme: (meme: MemeTemplate) => void;
  updateMeme: (id: string, updates: Partial<MemeTemplate>) => void;
  deleteMeme: (id: string) => void;
  setSelectedMeme: (meme: MemeTemplate | null) => void;
  setMemesLoading: (loading: boolean) => void;
  setMemesError: (error: string | null) => void;
  
  // Reset actions
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
      memes: [],
      selectedMeme: null,
      memesLoading: false,
      memesError: null,

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
      setUploadedImage: (image) => set({ uploadedImage: image }),
      setUploadProgress: (progress) => set({ uploadProgress: progress }),
      setUploadError: (error) => set({ uploadError: error }),
      
      // Meme actions
      setMemes: (memes) => set({ memes }),
      addMeme: (meme) => set((state) => ({ memes: [meme, ...state.memes] })),
      updateMeme: (id, updates) =>
        set((state) => ({
          memes: state.memes.map((meme) =>
            meme.id === id ? { ...meme, ...updates } : meme
          ),
        })),
      deleteMeme: (id) =>
        set((state) => ({
          memes: state.memes.filter((meme) => meme.id !== id),
        })),
      setSelectedMeme: (meme) => set({ selectedMeme: meme }),
      setMemesLoading: (loading) => set({ memesLoading: loading }),
      setMemesError: (error) => set({ memesError: error }),
      
      // Reset actions
      resetUploadState: () => set({
        uploadedImage: null,
        uploadProgress: 0,
        uploadError: null,
      }),
      clearStore: () => set({ user: null, uploadedImage: null, memes: [], selectedMeme: null }),
    }),
    {
      name: 'meme-generator-storage', // Nom de la clé dans le localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        memes: state.memes,
      }), // Ne persiste que l'état de l'utilisateur
    }
  )
); 