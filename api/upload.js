const { put } = require('@vercel/blob');
const { json, readBody, requireAuth } = require('./_utils');

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/svg+xml',
]);

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const payload = requireAuth(req, res);
  if (!payload) return null;

  const url = new URL(req.url, `http://${req.headers.host}`);
  const filename = url.searchParams.get('filename');
  if (!filename) {
    return json(res, 400, { error: 'Missing filename' });
  }

  const contentType = req.headers['content-type'] || 'application/octet-stream';
  const extension = filename.split('.').pop()?.toLowerCase();
  const typeMap = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    svg: 'image/svg+xml'
  };
  const fallbackType = extension ? typeMap[extension] : null;
  const finalType = ALLOWED_TYPES.has(contentType) ? contentType : fallbackType;
  if (!finalType) {
    return json(res, 415, { error: 'Unsupported file type' });
  }

  const buffer = await readBody(req);
  if (!buffer.length) {
    return json(res, 400, { error: 'Empty upload' });
  }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    return json(res, 413, { error: 'File too large. Max 4MB.' });
  }

  const pathname = `certificates/${Date.now()}-${sanitizeFilename(filename)}`;
  const blob = await put(pathname, buffer, {
    access: 'private',
    addRandomSuffix: true,
    contentType: finalType,
  });

  return json(res, 200, { blob });
};
