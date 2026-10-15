import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MoveYourBody',
    short_name: 'MoveYourBody',
    description: 'Personalized micro-workouts powered by on-device AI. Your body in motion, your data in control.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d1f15',
    theme_color: '#0d1f15',
    icons: [
      { src: '/brand/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icons/MoveYourBody_logo.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    related_applications: [{ platform: 'play', id: 'org.aossie.move', url: 'https://play.google.com/store/apps/details?id=org.aossie.move' }],
  };
}
