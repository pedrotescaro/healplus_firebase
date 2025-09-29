import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export class ImageStorageService {
  private static storage = getStorage();

  /**
   * Save image data URI to Firebase Storage
   */
  static async saveImage(
    dataUri: string,
    path: string
  ): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      const snapshot = await uploadString(storageRef, dataUri, 'data_url');
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error saving image to Firebase Storage:", error);
      throw new Error("Failed to save image.");
    }
  }

  /**
   * Get image download URL from Firebase Storage
   */
  static async getImageUrl(path: string): Promise<string | null> {
    try {
      const storageRef = ref(this.storage, path);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error getting image URL from Firebase Storage:", error);
      return null;
    }
  }

  /**
   * Delete image from Firebase Storage
   */
  static async deleteImage(path: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Error deleting image from Firebase Storage:", error);
      // It's okay to fail silently if the image doesn't exist.
    }
  }

  /**
   * Save image with a unique ID in a specific path (e.g., 'profile-pictures/userId/uniqueId.jpg')
   */
  static async saveImageWithPath(
    dataUri: string,
    userId: string,
    folder: string,
    metadata?: { fileName?: string, mimeType?: string }
  ): Promise<string> {
    const fileName = metadata?.fileName || `${uuidv4()}.jpg`;
    const path = `${folder}/${userId}/${fileName}`;
    return this.saveImage(dataUri, path);
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

        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUri = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUri);
      };
      img.src = dataUri;
    });
  }
}
