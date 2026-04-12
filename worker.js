// Cloudflare Worker - serve static files from GitHub repo
const GITHUB_USER = "Dev-anono";
const GITHUB_REPO = "Minecraft";
const BRANCH = "main";
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}`;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain',
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Default to index.html
    if (path === '/' || path === '') {
      path = '/index.html';
    }

    // Fetch from GitHub raw
    const githubUrl = RAW_BASE + path;
    const response = await fetch(githubUrl);

    if (!response.ok) {
      return new Response('Not Found', { status: 404 });
    }

    const contentType = MIME_TYPES[path.substring(path.lastIndexOf('.'))] || 'text/plain';

    return new Response(response.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
};
