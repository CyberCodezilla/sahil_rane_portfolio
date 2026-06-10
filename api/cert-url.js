const { json, requireAuth, signPathname } = require('./_utils');

const SIGNED_TTL_MS = 12 * 60 * 60 * 1000;

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const payload = requireAuth(req, res);
  if (!payload) return null;

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.searchParams.get('pathname');
  if (!pathname) {
    return json(res, 400, { error: 'Missing pathname' });
  }

  const expiresAt = Date.now() + SIGNED_TTL_MS;
  const sig = signPathname(pathname, expiresAt);
  const viewUrl = `/api/cert-file?pathname=${encodeURIComponent(pathname)}&exp=${expiresAt}&sig=${sig}`;

  return json(res, 200, { viewUrl, expiresAt });
};
