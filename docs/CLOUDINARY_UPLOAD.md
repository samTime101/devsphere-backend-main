# CLOUDINARY IMAGE UPLOAD

## Overview
Upload images to Cloudinary cloud storage using controller-service pattern.

## Setup Required
Environment variables in `.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Implementation Example: Update Profile with Image

### 1. Router
```typescript
// user.router.ts
import upload from '@/lib/multer';
import { userController } from '@/controllers/user.controller';

router.patch('/profile', upload.single('profileImage'), userController.updateProfile);
```

### 2. Controller
```typescript
// user.controller.ts
import { userService } from '@/services/user.service';

export const userController = {
  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user.id; // from auth middleware
      const updateData = req.body;
      const imageFile = req.file;

      const result = await userService.updateProfile(userId, updateData, imageFile);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }
};
```

### 3. Service
```typescript
// user.service.ts
import { uploadImageToCloudinary } from '@/utils/cloudinary.uploader';
import prisma from '@/db/prisma';

export const userService = {
  updateProfile: async (userId: string, updateData: any, imageFile?: Express.Multer.File) => {
    let profileImageUrl = undefined;

    // Upload image if provided
    if (imageFile) {
      const uploadResult = await uploadImageToCloudinary(imageFile.path, {
        folder: 'profile_images'
      });
      
      if (uploadResult.success) {
        profileImageUrl = uploadResult.url;
      } else {
        throw new Error('Image upload failed');
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        ...(profileImageUrl && { profileImage: profileImageUrl })
      }
    });

    return updatedUser;
  }
};
```

## Request Format
```
PATCH /api/user/profile
Content-Type: multipart/form-data

profileImage: [file]
name: "John Doe"
bio: "Software Developer"
```

## Response Format

### Success (200)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user123",
    "name": "John Doe",
    "bio": "Software Developer",
    "profileImage": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profile_images/filename.jpg"
  }
}
```

### Error (500)
```json
{
  "success": false,
  "message": "Failed to update profile"
}
```

## Notes
- Uses multer for handling multipart form data
- Images uploaded to `profile_images` folder in Cloudinary
- Supports JPG, PNG, JPEG, WEBP formats
- Image upload is optional in the example
