/**
 * Fallback storage service for when Realtime Database is not available
 * Uses localStorage as a temporary solution
 */

export interface FallbackImageData {
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

export class FallbackStorageService {
  private static readonly STORAGE_KEY = 'healplus_images';

  /**
   * Save image to localStorage as fallback
   */
  static saveImage(
    dataUri: string,
    userId: string,
    metadata?: Partial<FallbackImageData['metadata']>
  ): string {
    try {
      const imageId = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const imageData: FallbackImageData = {
        id: imageId,
        dataUri,
        metadata: {
          uploadedAt: Date.now(),
          uploadedBy: userId,
          ...metadata
        }
      };

      const existingData = this.getAllImages();
      existingData[imageId] = imageData;
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData));
      return imageId;
    } catch (error) {
      console.error('Error saving to fallback storage:', error);
      throw new Error('Failed to save image to fallback storage');
    }
  }

  /**
   * Get image from localStorage
   */
  static getImage(imageId: string): FallbackImageData | null {
    try {
      const allImages = this.getAllImages();
      return allImages[imageId] || null;
    } catch (error) {
      console.error('Error getting from fallback storage:', error);
      return null;
    }
  }

  /**
   * Get all images from localStorage
   */
  static getAllImages(): Record<string, FallbackImageData> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error parsing fallback storage:', error);
      return {};
    }
  }

  /**
   * Clear all fallback images
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing fallback storage:', error);
    }
  }

  /**
   * Get storage usage info
   */
  static getStorageInfo(): { count: number; size: number } {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const size = data ? new Blob([data]).size : 0;
      const count = data ? Object.keys(JSON.parse(data)).length : 0;
      return { count, size };
    } catch (error) {
      return { count: 0, size: 0 };
    }
  }
}
