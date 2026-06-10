const { get } = require('@vercel/blob');
const { Readable } = require('stream');
const { verifySignedPathname } = require('./_utils');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.statusCode = 405;
    return res.end('Method not allowed');
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.searchParams.get('pathname');
  const exp = url.searchParams.get('exp');
  const sig = url.searchParams.get('sig');

  if (!verifySignedPathname(pathname, exp, sig)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  const result = await get(pathname, {
    access: 'private',
    ifNoneMatch: req.headers['if-none-match'] || undefined,
  });

  if (!result) {
    res.statusCode = 404;
    return res.end('Not found');
  }

  if (result.statusCode === 304) {
    res.statusCode = 304;
    res.setHeader('ETag', result.blob.etag);
    res.setHeader('Cache-Control', 'private, no-cache');
    return res.end();
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', result.blob.contentType || 'application/octet-stream');
  res.setHeader('Cache-Control', 'private, no-cache');
  res.setHeader('ETag', result.blob.etag);
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (!result.stream) {
    return res.end();
  }

  Readable.fromWeb(result.stream).pipe(res);
};
