/**
 * sw.js — à placer à la RACINE du dépôt GitHub Pages
 * (à côté de index.html), pas dans un sous-dossier.
 */

const CACHE_NAME = "9emepro-shell-v1"; // incrémente à chaque déploiement important
const SHELL_FILES = [
  "./",
  "./index.html"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(SHELL_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  const url = event.request.url;

  // Ne jamais intercepter les appels vers Apps Script (JSONP) :
  // ils doivent toujours passer par le réseau, jamais être mis en cache.
  if (url.indexOf("script.google.com") !== -1) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).catch(function () {
        return caches.match("./index.html");
      });
    })
  );
});
