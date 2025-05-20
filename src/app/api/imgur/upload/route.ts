import { NextResponse } from 'next/server';

const IMGUR_API_URL = 'https://api.imgur.com/3';
const CLIENT_ID = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID;

export async function POST(request: Request) {
  try {
    const { image, title } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const response = await fetch(`${IMGUR_API_URL}/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${CLIENT_ID}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image,
        title: title || 'Meme Upload',
        type: 'base64',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.data?.error || 'Failed to upload to Imgur');
    }

    return NextResponse.json({
      url: data.data.link,
      deleteHash: data.data.deletehash,
    });
  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload to Imgur' },
      { status: 500 }
    );
  }
} 