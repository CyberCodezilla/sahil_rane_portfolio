const { json, readJson, requireAuth, redis, signPathname } = require('./_utils');

const CONTENT_KEY = 'portfolio:content';
const SIGNED_TTL_MS = 12 * 60 * 60 * 1000;

function attachSignedUrls(content) {
  if (!content || !Array.isArray(content.certificates)) return content;
  const stamped = content.certificates.map((cert) => {
    if (!cert?.file?.pathname) return cert;
    const expiresAt = Date.now() + SIGNED_TTL_MS;
    const sig = signPathname(cert.file.pathname, expiresAt);
    const viewUrl = `/api/cert-file?pathname=${encodeURIComponent(cert.file.pathname)}&exp=${expiresAt}&sig=${sig}`;
    return { ...cert, viewUrl, expiresAt };
  });
  return { ...content, certificates: stamped };
}

function stripDerivedFields(content) {
  if (!content || !Array.isArray(content.certificates)) return content;
  const cleaned = content.certificates.map((cert) => {
    const { viewUrl, expiresAt, ...rest } = cert;
    return rest;
  });
  return { ...content, certificates: cleaned };
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const stored = await redis.get(CONTENT_KEY);
    if (!stored) {
      return json(res, 200, { content: null });
    }
    let parsed = stored;
    if (typeof stored === 'string') {
      try {
        parsed = JSON.parse(stored);
      } catch (error) {
        return json(res, 500, { error: 'Stored content is invalid' });
      }
    }
    return json(res, 200, { content: attachSignedUrls(parsed) });
  }

  if (req.method === 'POST') {
    const payload = requireAuth(req, res);
    if (!payload) return null;

    const body = await readJson(req);
    if (!body || typeof body !== 'object') {
      return json(res, 400, { error: 'Invalid payload' });
    }

    const sanitized = stripDerivedFields(body);
    await redis.set(CONTENT_KEY, JSON.stringify(sanitized));
    return json(res, 200, { ok: true });
  }

  res.setHeader('Allow', 'GET, POST');
  return json(res, 405, { error: 'Method not allowed' });
};
