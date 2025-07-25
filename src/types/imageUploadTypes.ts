/**
 * Image upload types for Cloudinary integration
 */

export type UploadContext = 
  | "event-images" 
  | "venue-images" 
  | "user-profile" 
  | "event-gallery" 
  | "venue-gallery" 
  | "thumbnails" 
  | "banners" 
  | "other";

export interface UploadImageArgs {
  file: File;
  context: UploadContext;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  url: string;
  signature: string;
}

export interface ImageCompressionOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png';
}
