import type { AuthContextProps } from 'react-oidc-context';
import { mediaApiBaseUrl } from '../services/config';
import { ApiError } from './user-api-client';

export const IMAGE_CATEGORIES = ['generic', 'race', 'item', 'user', 'avatars'] as const;

export type ImageCategory = (typeof IMAGE_CATEGORIES)[number];

export type MediaImage = {
  id: string;
  category: ImageCategory;
  url: string;
  storageKey: string;
  contentType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  originalFilename?: string;
  altText?: string;
  metadata?: Record<string, string>;
  owner: string;
};

export type MediaImagePage = {
  content: MediaImage[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
};

export type UploadImageInput = {
  file: Blob;
  filename: string;
  category: ImageCategory;
  altText?: string;
  metadata?: Record<string, string>;
};

const getAuthHeader = (auth: AuthContextProps): HeadersInit => ({
  Authorization: `Bearer ${auth.user?.access_token}`,
});

const getMediaApiBaseUrl = (): string => {
  if (!mediaApiBaseUrl) {
    throw new ApiError('Missing media API base URL', 0);
  }
  return mediaApiBaseUrl;
};

const readError = async (response: Response, fallback: string): Promise<ApiError> => {
  const err = await response.json().catch(() => ({}));
  const message = typeof err.message === 'string' ? err.message : fallback;
  return new ApiError(message, response.status);
};

export const mediaApiClient = {
  async fetchImages(auth: AuthContextProps, category: ImageCategory, page = 0, size = 24): Promise<MediaImagePage> {
    const params = new URLSearchParams({
      q: `category==${category}`,
      page: String(page),
      size: String(size),
    });
    const response = await fetch(`${getMediaApiBaseUrl()}/images?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeader(auth),
    });
    if (response.ok) {
      return await response.json();
    }
    throw await readError(response, `Failed to fetch images: ${response.statusText}`);
  },

  async uploadImage(auth: AuthContextProps, input: UploadImageInput): Promise<MediaImage> {
    const formData = new FormData();
    formData.append('file', input.file, input.filename);
    formData.append('category', input.category);
    if (input.altText) formData.append('altText', input.altText);
    if (input.metadata) formData.append('metadata', JSON.stringify(input.metadata));

    const response = await fetch(`${getMediaApiBaseUrl()}/images`, {
      method: 'POST',
      headers: getAuthHeader(auth),
      body: formData,
    });
    if (response.ok) {
      return await response.json();
    }
    throw await readError(response, `Failed to upload image: ${response.statusText}`);
  },
};
