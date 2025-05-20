import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  try {
    const { image, title } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400, headers }
      );
    }

    // Validate image data URL
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format. Only image files are supported.' },
        { status: 400, headers }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        { error: 'Imgur client ID not configured' },
        { status: 500, headers }
      );
    }

    // Extract base64 data and mime type
    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid image data format' },
        { status: 400, headers }
      );
    }

    const [, mimeType, base64Data] = matches;

    // Upload to Imgur
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${clientId}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Data,
        type: 'base64',
        title: title || 'Meme Upload',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.data?.error || 'Failed to upload to Imgur');
    }

    return NextResponse.json(
      {
        url: data.data.link,
        deleteHash: data.data.deletehash,
      },
      { headers }
    );
  } catch (error) {
    console.error('Imgur upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500, headers }
    );
  }
} 