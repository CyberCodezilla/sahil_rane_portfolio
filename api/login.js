const bcrypt = require('bcryptjs');
const {
  redis,
  json,
  readJson,
  setCookie,
  signToken,
  getClientIp,
} = require('./_utils');

const MAX_ATTEMPTS = 5;
const BLOCK_MINUTES = 15;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const body = await readJson(req);
  const username = body?.username || '';
  const password = body?.password || '';

  const ip = getClientIp(req);
  const lockKey = `auth:lock:${ip}`;
  const rawLock = await redis.get(lockKey);
  const lock = rawLock && typeof rawLock === 'string' ? JSON.parse(rawLock) : rawLock;

  if (lock?.blockedUntil && Date.now() < lock.blockedUntil) {
    return json(res, 429, { error: 'Too many attempts. Try again later.' });
  }

  const expectedUser = process.env.ADMIN_USER || '';
  const expectedHash = process.env.ADMIN_PASSWORD_HASH || '';

  const userOk = username === expectedUser;
  const passOk = expectedHash ? await bcrypt.compare(password, expectedHash) : false;

  if (!userOk || !passOk) {
    const count = (lock?.count || 0) + 1;
    const blockedUntil = count >= MAX_ATTEMPTS ? Date.now() + BLOCK_MINUTES * 60 * 1000 : null;
    await redis.set(
      lockKey,
      JSON.stringify({ count, blockedUntil }),
      { ex: BLOCK_MINUTES * 60 }
    );
    return json(res, 401, { error: 'Invalid credentials' });
  }

  await redis.del(lockKey);
  const token = signToken({ sub: username });
  const isSecure = req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production';

  setCookie(res, 'admin_token', token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'Strict',
    path: '/',
    maxAge: 60 * 30,
  });

  return json(res, 200, { ok: true });
};
