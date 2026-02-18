import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOGImage('NEWS');
}
