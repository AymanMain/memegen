export function validateImgurClientId() {
  if (!process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID) {
    throw new Error('Missing required Imgur configuration. Please check your .env.local file.');
  }
  return true;
} 