const CANONICAL_ORIGIN = "https://garagedoorrepairgenie.com";

const PAGE_ROUTES = new Set([
  "/garage-door-repair/",
  "/garage-door-spring-repair/",
  "/garage-door-torsion-spring-repair/",
  "/cost-to-replace-garage-door-spring/",
  "/garage-door-spring-snapped/",
  "/garage-door-opener-repair/",
  "/emergency-garage-door-repair/",
  "/off-track-garage-door-repair/",
  "/garage-door-cable-repair/",
  "/garage-door-wire-broke/",
  "/portland-or/",
  "/vancouver-wa/",
  "/savannah-ga/",
  "/marietta-ga/",
  "/atlanta-ga/",
  "/roswell-ga/",
  "/san-antonio-tx/",
  "/contact/"
]);

function pageAssetPath(pathname) {
  if (pathname === "/") return "/pages/home.html";
  if (!PAGE_ROUTES.has(pathname)) return null;
  return `/pages/${pathname.replaceAll("/", "")}.html`;
}

function branded404() {
  return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page Not Found | Garage Door Repair Genie</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <main class="not-found">
    <a class="brand" href="/"><img src="/logo.svg" alt="" width="40" height="40">Garage Door Repair Genie</a>
    <h1>Garage door problem? This page disappeared.</h1>
    <p>The page you requested was not found. Call now for fast help or return home.</p>
    <div class="actions">
      <a class="btn btn-primary" href="tel:+10000000000">Call Now</a>
      <a class="btn btn-secondary" href="/">Go Home</a>
    </div>
  </main>
</body>
</html>`, {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (url.pathname !== "/" && !url.pathname.includes(".") && !url.pathname.endsWith("/")) {
      url.pathname = `${url.pathname}/`;
      return Response.redirect(url.toString(), 301);
    }

    const pagePath = pageAssetPath(url.pathname);
    if (pagePath) {
      const assetUrl = new URL(pagePath, CANONICAL_ORIGIN);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) return assetResponse;

    return branded404();
  }
};
