import { Metadata } from 'next';
import MemeViewer from '@/components/MemeViewer';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  console.log(id);
  return {
    title: 'Meme Viewer - MemeGen',
    description: 'View and share your meme',
  };
}

// Page component
export default async function MemePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MemeViewer id={id} />;
}
