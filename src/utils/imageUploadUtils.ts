/**
 * Image upload utilities for validation, compression and handling
 */

import type { ImageCompressionOptions } from "../types/imageUploadTypes";

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates if the file is a valid image type
 */
export const isValidImage = (file: File): boolean => {
  const validTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];
  return validTypes.includes(file.type.toLowerCase());
};

/**
 * Validates if the image size is within the allowed limit
 */
export const isValidImageSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Comprehensive image validation
 */
export const validateImage = (file: File, maxSizeMB: number = 10): ImageValidationResult => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (!isValidImage(file)) {
    return { 
      isValid: false, 
      error: 'Please select a valid image file (JPEG, PNG, GIF, WebP, SVG)' 
    };
  }

  if (!isValidImageSize(file, maxSizeMB)) {
    return { 
      isValid: false, 
      error: `Image size should be less than ${maxSizeMB}MB` 
    };
  }

  return { isValid: true };
};

/**
 * Compresses an image file while maintaining quality
 */
export const compressImage = async (
  file: File, 
  options: ImageCompressionOptions = {}
): Promise<File> => {
  const {
    quality = 0.8,
    maxWidth = 1920,
    maxHeight = 1080,
    format = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        
        if (width > height) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          const compressedFile = new File([blob], file.name, {
            type: `image/${format}`,
            lastModified: Date.now(),
          });
          
          resolve(compressedFile);
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Creates a preview URL for the selected image
 */
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Formats file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets image dimensions
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

/**
 * Generates a unique filename with timestamp
 */
export const generateUniqueFileName = (originalName: string, context: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${context}_${timestamp}_${randomString}.${extension}`;
};
