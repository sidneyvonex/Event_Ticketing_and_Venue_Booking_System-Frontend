# Image Upload System Documentation

## Overview

This project uses **Cloudinary** for direct client-side image uploads with compression and validation. The system is designed for an event ticketing platform with support for various image contexts.

## Setup Instructions

### 1. Cloudinary Account Setup

1. Create a free account at [https://cloudinary.com](https://cloudinary.com)
2. Go to your [Cloudinary Console](https://cloudinary.com/console)
3. Note down your **Cloud Name** (format: `dxxxxxxx`)
4. Create an **Upload Preset**:
   - Go to Settings → Upload → Upload presets
   - Click "Add upload preset"
   - Set it to **Unsigned** (for client-side uploads)
   - Configure folder structure and transformations as needed
   - Note the preset name

### 2. Environment Variables

Update your `.env` file with your Cloudinary credentials:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

### 3. Add to Redux Store

Add the uploadApi to your store configuration:

```typescript
import { uploadApi } from "../api/uploadApi";

export const store = configureStore({
  reducer: {
    // ...existing reducers
    [uploadApi.reducerPath]: uploadApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(/* existing middleware */)
      .concat(uploadApi.middleware),
});
```

## Usage Examples

### Basic Upload

```typescript
import { useUploadImageMutation } from "../../Features/api/uploadApi";

const [uploadImage, { isLoading }] = useUploadImageMutation();

const handleImageUpload = async (file: File) => {
  try {
    const result = await uploadImage({
      file,
      context: "event-images",
    }).unwrap();
    
    console.log("Uploaded:", result.secure_url);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### Advanced Upload with Compression

```typescript
const handleImageUpload = async (file: File) => {
  try {
    const result = await uploadImage({
      file,
      context: "venue-images",
      quality: 0.8,      // 80% quality
      maxWidth: 1200,    // Max width
      maxHeight: 800,    // Max height
    }).unwrap();
    
    // Use result.secure_url for your image
    setImageUrl(result.secure_url);
  } catch (error) {
    toast.error("Upload failed");
  }
};
```

### With Validation

```typescript
import { validateImage } from "../../utils/imageUploadUtils";

const handleFileSelect = async (file: File) => {
  // Validate file
  const validation = validateImage(file, 10); // 10MB max
  if (!validation.isValid) {
    toast.error(validation.error);
    return;
  }
  
  // Upload file
  await handleImageUpload(file);
};
```

## Upload Contexts

The system supports different upload contexts for organization:

- `"event-images"` - Main event images
- `"venue-images"` - Venue photos
- `"user-profile"` - User profile pictures
- `"event-gallery"` - Event photo galleries
- `"venue-gallery"` - Venue photo galleries
- `"thumbnails"` - Thumbnail images
- `"banners"` - Banner/header images
- `"other"` - Miscellaneous uploads

## Features

### ✅ **Image Compression**
- Automatic compression before upload
- Configurable quality (0-1)
- Maintains aspect ratio
- Reduces file size significantly

### ✅ **Validation**
- File type validation (JPEG, PNG, GIF, WebP, SVG)
- File size limits (configurable)
- Comprehensive error messages

### ✅ **Utilities**
- Image preview generation
- File size formatting
- Image dimension detection
- Unique filename generation

### ✅ **TypeScript Support**
- Full type definitions
- IntelliSense support
- Type-safe upload contexts

## API Response

The upload returns a Cloudinary response with:

```typescript
{
  secure_url: string;     // HTTPS URL of uploaded image
  public_id: string;      // Cloudinary public ID
  width: number;          // Image width
  height: number;         // Image height
  format: string;         // Image format (jpg, png, etc.)
  resource_type: string;  // "image"
  created_at: string;     // Upload timestamp
  bytes: number;          // File size in bytes
  url: string;            // HTTP URL (use secure_url instead)
  signature: string;      // Upload signature
}
```

## Error Handling

The system provides detailed error handling:

- Environment configuration errors
- File validation errors
- Upload failures
- Network errors

## Security

- Uses **unsigned upload presets** for client-side uploads
- No API secrets exposed to frontend
- Cloudinary handles all security aspects
- Upload presets can restrict file types and sizes

## Performance

- **Image compression** reduces upload times
- **Direct upload** to Cloudinary (no backend bottleneck)
- **Lazy loading** support with Cloudinary URLs
- **Automatic optimization** via Cloudinary transformations

---

For more advanced configurations, refer to the [Cloudinary Documentation](https://cloudinary.com/documentation).
