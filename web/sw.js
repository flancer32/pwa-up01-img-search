/**
 * Service worker to provide minimal PWA capabilities (installation only).
 */
'use strict';
// VARS
// Cache store name to save static resources
const CACHE_STATIC = 'static-cache-v1';
// Minimal set of files to cache to be a PWA
const FILES_TO_CACHE = [
    './',
    './css/vars.css',
    './favicon.ico',
    './img/favicon-180.png',
    './img/favicon-192.png',
    './img/favicon-512.png',
    './img/loading.gif',
    './index.html',
    './pwa.json',
    './src/vue-router/vue-router.global.prod.js',
    './src/vue/vue.global.prod.js',
    './styles.css',
    './web/@teqfw/web/js/bootstrap.mjs',
];

// FUNCS

/**
 * Load and store required static resources on installation.
 * @param {ExtendableEvent} evt
 */
function hndlEventInstall(evt) {
    // FUNCS
    async function cacheStaticFiles() {
        const cacheStat = await caches.open(CACHE_STATIC);
        // load all resources at the same time (parallel)
        await Promise.all(
            FILES_TO_CACHE.map(function (url) {
                return cacheStat.add(url).catch(function (reason) {
                    console.log(`'${url}' failed: ${String(reason)}`);
                });
            })
        );
    }

    // MAIN
    //  wait until all static files will be cached
    evt.waitUntil(cacheStaticFiles());
}

/**
 * Return static resource from cache (if exists) or fetch from network.
 * @param {FetchEvent} evt
 */
function hndlEventFetch(evt) {
    async function cacheOrFetch(req) {
        const cache = await self.caches.open(CACHE_STATIC);
        const cachedResponse = await cache.match(req);
        return cachedResponse ?? await fetch(req);
    }

    evt.respondWith(cacheOrFetch(evt.request));
}

// MAIN
self.addEventListener('install', hndlEventInstall);
self.addEventListener('fetch', hndlEventFetch);
self.addEventListener('activate', () => self.clients.claim());