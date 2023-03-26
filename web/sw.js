/**
 * Service worker to provide minimal PWA capabilities (installation only).
 */
'use strict';
// MODULE'S IMPORT
import DefWebEvt from './src/@teqfw/web-event/Shared/Defaults.mjs';
import DefApp from './src/@flancer32/pwa-up01-img-search/Shared/Defaults.mjs';

// VARS
// Cache store name to save static resources
const CACHE_STATIC = 'static-cache-v1';
// Minimal set of files to cache to be a PWA (see ./web/)
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
    './styles.css',
    './sw.js',
];
/** @type {TeqFw_Web_Event_Shared_Defaults} */
const DEF_WEB_EVT = new DefWebEvt();
/** @type {App_Shared_Defaults} */
const DEF_APP = new DefApp();

// FUNCS

/**
 * Load and store required static resources on installation.
 * @param {ExtendableEvent} evt
 */
function onInstall(evt) {
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
 * @param {FetchEvent} event
 */
function onFetch(event) {
    // FUNCS
    /**
     * Analyze route's URL and return 'true' if request should not be cached.
     * Always skip requests for images and SSE opening.
     *
     * @param {Request} req
     * @returns {boolean}
     */
    function detectBypass(req) {
        const IMG = new RegExp(`(.*)(\\/${DEF_APP.SPACE_IMAGE}\\/)(.*)`);
        const SSE_OPEN = new RegExp(`(.*)(\\/${DEF_WEB_EVT.SPACE_STREAM_OPEN}\\/)(.*)`);
        return !!(
            req.method === 'POST' ||
            req.url.match(IMG) ||
            req.url.match(SSE_OPEN)
        );
    }

    async function getFromCacheOrFetchAndCache(event) {
        try {
            const cache = await self.caches.open(CACHE_STATIC);
            const cachedResponse = await cache.match(event.request);
            const url = new URL(event.request.url);
            // Get the pathname of the URL
            const path = url.pathname;
            if (cachedResponse) {
                console.log(`from cache: ${path}`);
                return cachedResponse;
            } else {
                // wait until resource will be fetched from server and stored in cache
                const resp = await fetch(event.request);
                await cache.put(event.request, resp.clone());
                console.log(`from net, saved to cache: ${path}`);
                return resp;
            }
        } catch (e) {
            console.error(`[SW] error: ${JSON.stringify(e)}`);
        }
    }

    // MAIN
    const bypass = detectBypass(event.request);
    if (bypass === false)
        event.respondWith(getFromCacheOrFetchAndCache(event));

}

// MAIN
self.addEventListener('install', onInstall);
self.addEventListener('fetch', onFetch);
self.addEventListener('activate', () => self.clients.claim());