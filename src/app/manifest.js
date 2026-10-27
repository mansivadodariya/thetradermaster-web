/**
 * Web App Manifest for ChronosX PWA (Next.js App Router)
 * @returns {import('next').MetadataRoute.Manifest}
 */
export default function manifest() {
  return {
    name: 'ChronosX — Next-Gen AI Trading Platform',
    short_name: 'ChronosX',
    description: 'Next-gen AI trading platform providing real-time AI trading signals, instant neural chart pattern recognition, and quantitative intelligence.',
    start_url: '/',
    id: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    background_color: '#08140F',
    theme_color: '#08140F',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    shortcuts: [
      {
        name: 'AI Terminal',
        short_name: 'Terminal',
        description: 'Open ChronosX AI Trading Desk',
        url: '/terminal',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
      },
      {
        name: 'Market Overview',
        short_name: 'Markets',
        description: 'View real-time market data',
        url: '/dashboard',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }]
      }
    ],
    categories: ['finance', 'productivity', 'utilities'],
    prefer_related_applications: false
  };
}
