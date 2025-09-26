
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimização de Imagens
  images: {
    // Formatos de imagem modernos para melhor compressão e qualidade
    formats: ['image/avif', 'image/webp'],
    // Domínios remotos permitidos para imagens (se houver)
    remotePatterns: [
       {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Otimizações de Compilador
  compiler: {
    // Remove `console.*` em produção para um build mais limpo
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
