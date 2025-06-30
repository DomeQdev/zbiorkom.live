module.exports = {
    globDirectory: "dist/",
    globPatterns: ["**/*.{js,css,html,png,svg,jpg,jpeg,json}"],
    swDest: "dist/service-worker.js",
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
        {
            urlPattern: /\.(?:js|css)$/,
            handler: "CacheFirst",
            options: {
                cacheName: "static-resources",
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                },
            },
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
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
    navigateFallbackDenylist: [/\.pdf$/],
};
