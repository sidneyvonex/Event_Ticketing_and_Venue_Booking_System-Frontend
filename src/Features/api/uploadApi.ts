import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { compressImage } from "../../utils/imageUploadUtils";
import type { CloudinaryUploadResponse, UploadImageArgs } from "../../types/imageUploadTypes";

// Cloudinary configuration from environment variables
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ['Upload'],
  endpoints: (builder) => ({
    uploadImage: builder.mutation<CloudinaryUploadResponse, UploadImageArgs>({
      async queryFn({ file, context, quality = 0.8, maxWidth = 1920, maxHeight = 1080 }) {
        try {
          // Validate environment variables
          if (!CLOUD_NAME || !UPLOAD_PRESET) {
            throw new Error('Cloudinary configuration missing. Please check your environment variables.');
          }

          // Compress the image before upload
          const compressedFile = await compressImage(file, {
            quality,
            maxWidth,
            maxHeight,
            format: 'jpeg'
          });

          // Prepare form data for Cloudinary (minimal unsigned upload)
          const formData = new FormData();
          formData.append("file", compressedFile);
          formData.append("upload_preset", UPLOAD_PRESET);
          
          // Add folder for organization (skip for 'other' context)
          if (context && context !== 'other') {
            formData.append("folder", context);
          }

          // Upload to Cloudinary
          const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `Upload failed with status: ${response.status}`);
          }

          const data = (await response.json()) as CloudinaryUploadResponse;
          
          
          // Validate response data
          if (!data.secure_url) {
            throw new Error('Invalid response from Cloudinary');
          }

          return { data };
        } catch (error: unknown) {

          const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.';
          return { 
            error: { 
              status: 500, 
              data: errorMessage
            } 
          };
        }
      },
      invalidatesTags: ['Upload'],
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
