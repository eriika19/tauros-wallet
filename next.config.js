const withCSS = require('@zeit/next-css');
const withOffline = require('next-offline');
const { withPlugins } = require('next-compose-plugins');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const webpack = require('webpack');
const path = require('path');
require('dotenv').config();

const nextConfig = {
  // Workbox Options
  workboxOpts: {
    clientsClaim: true,
    skipWaiting: true,
    swDest: path.join(__dirname, 'public/service-worker.js'),

    // runtimeCaching: [
    //   {
    //     urlPattern: /^https?.*/,
    //     handler: 'NetworkFirst',
    //     options: {
    //       cacheName: 'OfflineCache',
    //       expiration: {
    //         maxEntries: 200,
    //       },
    //     },
    //   },
    //   {
    //     urlPattern: new RegExp(`^${BASE_URL}`),
    //     handler: 'StaleWhileRevalidate',
    //     options: {
    //       cacheName: 'api-cache',
    //       cacheableResponse: {
    //         statuses: [0, 200],
    //         headers: {
    //           'x-test': 'true',
    //         },
    //       },
    //     },
    //   },
    //   {
    //     urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
    //     handler: 'CacheFirst',
    //   },
    //   {
    //     urlPattern: /(results | question)/,
    //     handler: 'NetworkFirst',
    //     options: {
    //       cacheableResponse: {
    //         statuses: [0, 200],
    //         headers: {
    //           'x-test': 'true',
    //         },
    //       },
    //     },
    //   },
    // ],
  },

  webpack(config) {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };

    /*
     * Config for importing svgs
     */
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    /*
     * Returns environment variables as an object
     */
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});

    /*
     * Allows you to create global constants which can be configured
     * at compile time, like our environment variables
     */

    config.plugins.push(new webpack.DefinePlugin(env));

    // Now let's build our manifest

    // const PUBLIC_PATH = '..';

    // config.plugins.push(
    //   new WebpackPwaManifest({
    //     filename: 'static/manifest.json',
    //     name: 'Melp',
    //     short_name: 'Melp',
    //     description: 'Web App to find your favorite places to eat',
    //     background_color: '#FFF',
    //     theme_color: '#B2CCFF',
    //     display: 'standalone',
    //     orientation: 'portrait',
    //     fingerprints: false,
    //     inject: false,
    //     start_url: '/',
    //     ios: {
    //       'apple-mobile-web-app-title': 'Melp',
    //       'apple-mobile-web-app-status-bar-style': '#B2CCFF',
    //     },
    //     icons: [
    //       {
    //         src: path.resolve('/logo.png'),
    //         sizes: [36, 48, 72, 96, 144, 192, 512],
    //         destination: '/static',
    //       },
    //       {
    //         src: path.resolve('/logo.png'),
    //         sizes: [120, 152, 167, 180, 1024],
    //         destination: '/static',
    //         ios: true,
    //       },
    //       {
    //         src: path.resolve('/logo.png'),
    //         size: 1024,
    //         destination: '/static',
    //         ios: 'startup',
    //       },
    //     ],
    //     includeDirectory: true,
    //     publicPath: PUBLIC_PATH,
    //   }),
    // );

    return config;
  },
};

module.exports = withPlugins([[withCSS], [withOffline]], nextConfig);

// module.exports = {
//   webpack: config => {
//     /*
//      * Config for importing svgs
//      */
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ['@svgr/webpack'],
//     });
//     /*
//      * Returns environment variables as an object
//      */
//     const env = Object.keys(process.env).reduce((acc, curr) => {
//       acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
//       return acc;
//     }, {});

//     /*
//      * Allows you to create global constants which can be configured
//      * at compile time, like our environment variables
//      */
//     config.plugins.push(new webpack.DefinePlugin(env));
//     return config;
//   },
// };
