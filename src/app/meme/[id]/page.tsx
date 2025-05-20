import { Metadata } from 'next';
import MemeViewer from '@/components/MemeViewer';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

// Page component
export default function MemePage({ params }: Props) {
  return <MemeViewer id={params.id} />;
}
