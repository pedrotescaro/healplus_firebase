import { ImageStorageService } from "./image-storage";

/**
 * Utility functions to retrieve and display images from Realtime Database
 */
export class ImageRetrievalService {
  /**
   * Get image data URI from image ID
   */
  static async getImageDataUri(userId: string, imageId: string): Promise<string | null> {
    try {
      const imageData = await ImageStorageService.getImage(userId, imageId);
      return imageData?.dataUri || null;
    } catch (error) {
      console.error('Error retrieving image:', error);
      return null;
    }
  }

  /**
   * Get all images for a user with metadata
   */
  static async getUserImagesWithMetadata(userId: string) {
    try {
      return await ImageStorageService.getUserImages(userId);
    } catch (error) {
      console.error('Error retrieving user images:', error);
      return [];
    }
  }

  /**
   * Check if a string is an image ID (not a data URI or URL)
   */
  static isImageId(value: string): boolean {
    // Image IDs are typically UUIDs or Firebase push IDs
    // They don't start with 'data:' or 'http'
    return !value.startsWith('data:') && !value.startsWith('http');
  }

  /**
   * Resolve image source - if it's an ID, get the data URI, otherwise return as is
   */
  static async resolveImageSource(userId: string, imageSource: string): Promise<string | null> {
    if (this.isImageId(imageSource)) {
      return await this.getImageDataUri(userId, imageSource);
    }
    return imageSource; // Already a data URI or URL
  }

  /**
   * Get image for display in components
   */
  static async getDisplayImage(userId: string, imageSource: string): Promise<string> {
    const resolved = await this.resolveImageSource(userId, imageSource);
    return resolved || '/placeholder-image.png'; // Fallback image
  }
}
