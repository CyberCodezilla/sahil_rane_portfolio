const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();
const COOKIE_NAME = 'admin_token';

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function readJson(req) {
  const buffer = await readBody(req);
  if (!buffer.length) {
    return null;
  }
  try {
    return JSON.parse(buffer.toString('utf8'));
  } catch (error) {
    return null;
  }
}

function parseCookies(req) {
  const header = req.headers?.cookie || '';
  return header.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

function setCookie(res, name, value, options = {}) {
  const pieces = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) pieces.push(`Max-Age=${options.maxAge}`);
  if (options.path) pieces.push(`Path=${options.path}`);
  if (options.httpOnly) pieces.push('HttpOnly');
  if (options.secure) pieces.push('Secure');
  if (options.sameSite) pieces.push(`SameSite=${options.sameSite}`);
  res.setHeader('Set-Cookie', pieces.join('; '));
}

function signToken(payload, expiresIn = '30m') {
  const secret = process.env.JWT_SECRET || '';
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token) {
  try {
    const secret = process.env.JWT_SECRET || '';
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

function getAuthPayload(req) {
  const cookies = parseCookies(req);
  if (!cookies[COOKIE_NAME]) return null;
  return verifyToken(cookies[COOKIE_NAME]);
}

function requireAuth(req, res) {
  const payload = getAuthPayload(req);
  if (!payload) {
    json(res, 401, { error: 'Unauthorized' });
    return null;
  }
  return payload;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function toSafeNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function signPathname(pathname, expiresAt) {
  const secret = process.env.JWT_SECRET || '';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${pathname}:${expiresAt}`);
  return hmac.digest('hex');
}

function verifySignedPathname(pathname, expiresAt, signature) {
  if (!pathname || !expiresAt || !signature) return false;
  const exp = toSafeNumber(expiresAt);
  if (!exp || Date.now() > exp) return false;
  const expected = signPathname(pathname, exp);
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

module.exports = {
  redis,
  COOKIE_NAME,
  json,
  readBody,
  readJson,
  parseCookies,
  setCookie,
  signToken,
  verifyToken,
  getAuthPayload,
  requireAuth,
  getClientIp,
  signPathname,
  verifySignedPathname,
};
