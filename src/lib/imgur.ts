// Validate Imgur configuration
if (!process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID) {
  throw new Error('Missing required Imgur configuration. Please check your .env.local file.');
}

// Helper function to upload files to Imgur
export async function uploadFileToImgur(
  file: File | Blob,
  title: string = 'Meme Upload'
): Promise<{ url: string; deleteHash: string; error: Error | null }> {
  try {
    // Convert File/Blob to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Upload to our API route
    const response = await fetch('/api/imgur/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64,
        title,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload to Imgur');
    }

    return { 
      url: data.url, 
      deleteHash: data.deleteHash,
      error: null 
    };
  } catch (error) {
    console.error('Error uploading file to Imgur:', error);
    return { url: '', deleteHash: '', error: error as Error };
  }
}

// Helper function to delete files from Imgur
export async function deleteFileFromImgur(
  deleteHash: string
): Promise<{ error: Error | null }> {
  try {
    const response = await fetch(`/api/imgur/delete?deleteHash=${deleteHash}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete from Imgur');
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting file from Imgur:', error);
    return { error: error as Error };
  }
} 