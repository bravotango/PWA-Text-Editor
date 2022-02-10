const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute(
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute(
    [
      {
        url: 'bundle.js',
        revision: '6de9d27ae878287aa32a89e88f4488e9',
      },
      {
        url: 'index.html',
        revision: '93502d6384ac6989a30686a34ba9dbbb',
      },
      {
        url: 'main.css',
        revision: '7d41498a95cd951e4b720913ddeba91e',
      },
    ],
    {}
  ),
  workbox.registerRoute(
    /.(?:png|jpg|jpeg|svg)$/,
    new workbox.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.ExpirationPlugin({
          maxEntries: 2,
        }),
      ],
    }),
    'GET'
  )
);
