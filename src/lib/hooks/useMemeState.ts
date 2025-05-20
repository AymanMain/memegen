import { useReducer, useCallback } from 'react';
import { Meme, MemeState, MemeAction, MemeTemplate } from '@/models/meme';

const initialState: MemeState = {
  currentMeme: {
    image: null,
    topText: '',
    bottomText: '',
    textStyle: {
      fontSize: 30,
      textColor: '#ffffff',
      fontFamily: 'Impact',
      strokeColor: '#000000',
      strokeWidth: 2,
      textAlign: 'center',
      textTransform: 'uppercase'
    },
    topTextPosition: { x: 50, y: 10 },
    bottomTextPosition: { x: 50, y: 90 }
  },
  history: {
    past: [],
    present: {
      image: null,
      topText: '',
      bottomText: '',
      textStyle: {
        fontSize: 30,
        textColor: '#ffffff',
        fontFamily: 'Impact',
        strokeColor: '#000000',
        strokeWidth: 2,
        textAlign: 'center',
        textTransform: 'uppercase'
      },
      topTextPosition: { x: 50, y: 10 },
      bottomTextPosition: { x: 50, y: 90 }
    },
    future: []
  },
  isLoading: false,
  error: null,
  templates: []
};

function memeReducer(state: MemeState, action: MemeAction): MemeState {
  switch (action.type) {
    case 'SET_MEME':
      return {
        ...state,
        currentMeme: { ...state.currentMeme, ...action.payload },
        history: {
          past: [...state.history.past, state.history.present],
          present: { ...state.history.present, ...action.payload },
          future: []
        }
      };

    case 'UNDO':
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      return {
        ...state,
        currentMeme: previous,
        history: {
          past: newPast,
          present: previous,
          future: [state.history.present, ...state.history.future]
        }
      };

    case 'REDO':
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      return {
        ...state,
        currentMeme: next,
        history: {
          past: [...state.history.past, state.history.present],
          present: next,
          future: newFuture
        }
      };

    case 'RESET':
      return {
        ...initialState,
        templates: state.templates
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'SET_TEMPLATES':
      return {
        ...state,
        templates: action.payload
      };

    default:
      return state;
  }
}

export function useMemeState() {
  const [state, dispatch] = useReducer(memeReducer, initialState);

  const setMeme = useCallback((meme: Partial<Meme>) => {
    dispatch({ type: 'SET_MEME', payload: meme });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setTemplates = useCallback((templates: MemeTemplate[]) => {
    dispatch({ type: 'SET_TEMPLATES', payload: templates });
  }, []);

  return {
    state,
    setMeme,
    undo,
    redo,
    reset,
    setLoading,
    setError,
    setTemplates
  };
} 