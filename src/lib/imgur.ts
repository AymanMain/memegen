import { validateImgurClientId } from './utils';

// Validate Imgur configuration
if (!process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID) {
  throw new Error('Missing required Imgur configuration. Please check your .env.local file.');
}

// Helper function to upload files to Imgur
export async function uploadFileToImgur(file: File | Blob, title?: string) {
  validateImgurClientId();

  try {
    // Convert file to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Get the base64 string without the data URL prefix
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

    // Get file type
    const fileType = file instanceof File ? file.type : file.type;
    if (!fileType.startsWith('image/')) {
      throw new Error('Only image files are supported');
    }

    // Create form data
    const formData = new FormData();
    formData.append('image', base64);
    formData.append('type', 'base64');
    if (title) {
      formData.append('title', title);
    }

    // Upload to Imgur
    const response = await fetch('/api/imgur/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: `data:${fileType};base64,${base64}`,
        title: title || 'Meme Upload',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload to Imgur');
    }

    return {
      url: data.url,
      deleteHash: data.deleteHash,
      error: null,
    };
  } catch (error) {
    console.error('Imgur upload error:', error);
    return {
      url: null,
      deleteHash: null,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

// Helper function to delete files from Imgur
export async function deleteFileFromImgur(deleteHash: string) {
  try {
    const response = await fetch(`/api/imgur/delete?deleteHash=${deleteHash}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete from Imgur');
    }

    return { error: null };
  } catch (error) {
    console.error('Imgur delete error:', error);
    return {
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
} 