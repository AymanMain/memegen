export interface Position {
  x: number;
  y: number;
}

export interface TextStyle {
  fontSize: number;
  textColor: string;
  fontFamily: string;
  strokeColor?: string;
  strokeWidth?: number;
  textAlign?: 'left' | 'center' | 'right';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface MemeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  defaultTextStyle: TextStyle;
  defaultPositions: {
    top: Position;
    bottom: Position;
  };
}

export interface Meme {
  id?: string;
  image: File | null;
  imageUrl?: string;
  topText: string;
  bottomText: string;
  textStyle: TextStyle;
  topTextPosition: Position;
  bottomTextPosition: Position;
  template?: MemeTemplate;
  createdAt?: Date;
  updatedAt?: Date;
  shareableUrl?: string;
  likes?: number;
  viewCount?: number;
  shareCount?: number;
}

export interface MemeHistory {
  past: Meme[];
  present: Meme;
  future: Meme[];
}

export interface MemeState {
  currentMeme: Meme;
  history: MemeHistory;
  isLoading: boolean;
  error: string | null;
  templates: MemeTemplate[];
}

export type MemeAction =
  | { type: 'SET_MEME'; payload: Partial<Meme> }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TEMPLATES'; payload: MemeTemplate[] }; 