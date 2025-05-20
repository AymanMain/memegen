import { Metadata } from 'next';
import MemeViewer from '@/components/MemeViewer';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: 'View Meme | Meme Generator',
    description: 'View and share your meme with the world!',
    openGraph: {
      title: 'View Meme | Meme Generator',
      description: 'View and share your meme with the world!',
      type: 'website',
    },
  };
}

export default function MemePage({ params }: PageProps) {
  return <MemeViewer id={params.id} />;
} 