// Configurações de performance para o aplicativo

export const PERFORMANCE_CONFIG = {
  // Configurações de cache
  CACHE: {
    // Duração do cache em milissegundos
    DURATION: {
      SHORT: 5 * 60 * 1000, // 5 minutos
      MEDIUM: 30 * 60 * 1000, // 30 minutos
      LONG: 24 * 60 * 60 * 1000, // 24 horas
    },
    // Tamanho máximo do cache
    MAX_SIZE: 100,
  },

  // Configurações de debounce/throttle
  TIMING: {
    DEBOUNCE: {
      SEARCH: 300,
      INPUT: 500,
      API_CALL: 1000,
    },
    THROTTLE: {
      SCROLL: 16, // ~60fps
      RESIZE: 100,
      API_CALL: 2000,
    },
  },

  // Configurações de imagens
  IMAGES: {
    QUALITY: 75,
    PLACEHOLDER: 'blur',
    SIZES: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    FORMATS: ['image/webp', 'image/avif'],
  },

  // Configurações de lazy loading
  LAZY_LOADING: {
    ROOT_MARGIN: '50px',
    THRESHOLD: 0.1,
    DELAY: 0,
  },

  // Configurações de virtualização
  VIRTUALIZATION: {
    ITEM_HEIGHT: 60,
    OVERSCAN: 5,
    CONTAINER_HEIGHT: 400,
  },

  // Configurações de bundle
  BUNDLE: {
    CHUNK_SIZE_LIMIT: 250000, // 250KB
    WARNING_SIZE: 200000, // 200KB
  },

  // Configurações de Firebase
  FIREBASE: {
    BATCH_SIZE: 500,
    RETRY_ATTEMPTS: 3,
    TIMEOUT: 10000,
  },
} as const;

// Função para verificar se o dispositivo é móvel
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

// Função para verificar conexão lenta
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.connection?.effectiveType === 'slow-2g' || 
         navigator.connection?.effectiveType === '2g';
}

// Função para obter configurações baseadas no dispositivo
export function getDeviceConfig() {
  const isMobile = isMobileDevice();
  const isSlow = isSlowConnection();

  return {
    imageQuality: isSlow ? 50 : PERFORMANCE_CONFIG.IMAGES.QUALITY,
    enableLazyLoading: true,
    enableVirtualization: isMobile,
    cacheDuration: isSlow ? PERFORMANCE_CONFIG.CACHE.DURATION.LONG : PERFORMANCE_CONFIG.CACHE.DURATION.MEDIUM,
    debounceDelay: isSlow ? PERFORMANCE_CONFIG.TIMING.DEBOUNCE.API_CALL : PERFORMANCE_CONFIG.TIMING.DEBOUNCE.SEARCH,
  };
}

// Função para otimizar imagens baseadas no contexto
export function getImageConfig(context: 'thumbnail' | 'preview' | 'full' | 'report') {
  const baseConfig = {
    quality: PERFORMANCE_CONFIG.IMAGES.QUALITY,
    placeholder: PERFORMANCE_CONFIG.IMAGES.PLACEHOLDER,
    sizes: PERFORMANCE_CONFIG.IMAGES.SIZES,
  };

  switch (context) {
    case 'thumbnail':
      return {
        ...baseConfig,
        quality: 60,
        sizes: '(max-width: 768px) 50vw, 25vw',
      };
    case 'preview':
      return {
        ...baseConfig,
        quality: 70,
        sizes: '(max-width: 768px) 100vw, 50vw',
      };
    case 'full':
      return {
        ...baseConfig,
        quality: 85,
        sizes: '100vw',
      };
    case 'report':
      return {
        ...baseConfig,
        quality: 90,
        sizes: '800px',
      };
    default:
      return baseConfig;
  }
}
