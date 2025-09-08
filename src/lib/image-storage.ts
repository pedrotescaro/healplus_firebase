import { realtimeDb } from "@/firebase/client-app";
import { ref, push, set, get, child } from "firebase/database";

export interface ImageData {
  id: string;
  dataUri: string;
  metadata: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    uploadedAt: number;
    uploadedBy: string;
  };
}

export class ImageStorageService {
  private static basePath = 'images';

  /**
   * Save image data to Realtime Database
   */
  static async saveImage(
    dataUri: string, 
    userId: string, 
    metadata?: Partial<ImageData['metadata']>
  ): Promise<string> {
    try {
      const imageRef = ref(realtimeDb, `${this.basePath}/${userId}`);
      const newImageRef = push(imageRef);
      
      const imageData: ImageData = {
        id: newImageRef.key!,
        dataUri,
        metadata: {
          uploadedAt: Date.now(),
          uploadedBy: userId,
          ...metadata
        }
      };

      await set(newImageRef, imageData);
      return newImageRef.key!;
    } catch (error) {
      console.error('Error saving image to Realtime Database:', error);
      throw new Error('Failed to save image');
    }
  }

  /**
   * Get image data from Realtime Database
   */
  static async getImage(userId: string, imageId: string): Promise<ImageData | null> {
    try {
      const imageRef = ref(realtimeDb, `${this.basePath}/${userId}/${imageId}`);
      const snapshot = await get(imageRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as ImageData;
      }
      return null;
    } catch (error) {
      console.error('Error getting image from Realtime Database:', error);
      throw new Error('Failed to get image');
    }
  }

  /**
   * Get all images for a user
   */
  static async getUserImages(userId: string): Promise<ImageData[]> {
    try {
      const imagesRef = ref(realtimeDb, `${this.basePath}/${userId}`);
      const snapshot = await get(imagesRef);
      
      if (snapshot.exists()) {
        const images = snapshot.val();
        return Object.values(images) as ImageData[];
      }
      return [];
    } catch (error) {
      console.error('Error getting user images from Realtime Database:', error);
      throw new Error('Failed to get user images');
    }
  }

  /**
   * Save image with specific path (for organized storage)
   */
  static async saveImageWithPath(
    dataUri: string,
    userId: string,
    path: string,
    metadata?: Partial<ImageData['metadata']>
  ): Promise<string> {
    try {
      const imageRef = ref(realtimeDb, `${this.basePath}/${userId}/${path}`);
      const newImageRef = push(imageRef);
      
      const imageData: ImageData = {
        id: newImageRef.key!,
        dataUri,
        metadata: {
          uploadedAt: Date.now(),
          uploadedBy: userId,
          ...metadata
        }
      };

      await set(newImageRef, imageData);
      return newImageRef.key!;
    } catch (error) {
      console.error('Error saving image with path to Realtime Database:', error);
      throw new Error('Failed to save image');
    }
  }

  /**
   * Convert file to data URI
   */
  static fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Compress image data URI to reduce size
   */
  static compressImage(
    dataUri: string, 
    maxWidth: number = 800, 
    quality: number = 0.8
  ): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUri = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUri);
      };
      img.src = dataUri;
    });
  }
}
