import { Metadata } from 'next';
import MemeViewer from '@/components/MemeViewer';

export async function generateMetadata(): Promise<Metadata> {
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
