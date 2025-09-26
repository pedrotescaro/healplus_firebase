// Tipos globais para o projeto Heal+

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_FIREBASE_API_KEY: string;
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
      NEXT_PUBLIC_FIREBASE_APP_ID: string;
      GEMINI_API_KEY: string;
    }
  }
}

// Tipos para bibliotecas que podem não ter tipos
declare module 'jspdf' {
  const jsPDF: any;
  export default jsPDF;
}

declare module 'jspdf-autotable' {
  const autoTable: any;
  export default autoTable;
}

declare module 'react-image-crop' {
  export interface Crop {
    x: number;
    y: number;
    width: number;
    height: number;
    unit?: string;
    aspect?: number;
  }
  
  export interface ReactCropProps {
    crop?: Crop;
    onChange?: (crop: Crop, percentCrop: Crop) => void;
    onComplete?: (crop: Crop, percentCrop: Crop) => void;
    onImageLoaded?: (image: HTMLImageElement) => void;
    onImageError?: (error: Error) => void;
    src: string;
    alt?: string;
    className?: string;
    style?: React.CSSProperties;
    imageStyle?: React.CSSProperties;
    children?: React.ReactNode;
  }
  
  const ReactCrop: React.FC<ReactCropProps>;
  export default ReactCrop;
}

export {};