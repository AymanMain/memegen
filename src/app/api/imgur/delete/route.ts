import { NextResponse } from 'next/server';

const IMGUR_API_URL = 'https://api.imgur.com/3';
const CLIENT_ID = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID;

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deleteHash = searchParams.get('deleteHash');

    if (!deleteHash) {
      return NextResponse.json(
        { error: 'No deleteHash provided' },
        { status: 400 }
      );
    }

    const response = await fetch(`${IMGUR_API_URL}/image/${deleteHash}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Client-ID ${CLIENT_ID}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.data?.error || 'Failed to delete from Imgur');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting from Imgur:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete from Imgur' },
      { status: 500 }
    );
  }
} 