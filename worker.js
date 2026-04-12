const GITHUB_USER = "Dev-anono";
const GITHUB_REPO = "Minecraft";
const BRANCH = "main";
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}`;

const MIME = {
  '.html': 'text/html', '.css': 'text/css',
  '.js': 'application/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname === '/' ? '/index.html' : url.pathname;
    const res = await fetch(RAW_BASE + path);
    if (!res.ok) return new Response('Not Found', { status: 404 });
    const ct = MIME[path.substring(path.lastIndexOf('.'))] || 'text/plain';
    return new Response(res.body, {
      headers: { 'Content-Type': ct, 'Cache-Control': 'public, max-age=3600' }
    });
  }
};
