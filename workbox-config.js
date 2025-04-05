module.exports = {
    globDirectory: "dist/",
    globPatterns: ["**/*.{js,css,html,png,svg,jpg,jpeg,json}"],
    swDest: "dist/service-worker.js",
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
        {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
                cacheName: "html-cache",
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 24 * 60 * 60,
                },
                networkTimeoutSeconds: 10,
            },
        },
        {
            urlPattern: /\.(?:js|css)$/,
            handler: "CacheFirst",
            options: {
                cacheName: "static-resources",
                expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                },
                plugins: [
                    {
                        cacheDidUpdate: async ({ cacheName }) => {
                            self.clients.matchAll().then((clients) => {
                                clients.forEach((client) => {
                                    client.postMessage({ type: "CACHE_UPDATED", cacheName });
                                });
                            });
                        },
                    },
                ],
            },
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: "CacheFirst",
            options: {
                cacheName: "image-cache",
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                },
            },
        },
    ],
    navigateFallback: "/index.html",
};
