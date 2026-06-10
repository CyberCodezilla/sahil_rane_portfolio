const { json, setCookie } = require('./_utils');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const isSecure = req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production';

  setCookie(res, 'admin_token', '', {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'Strict',
    path: '/',
    maxAge: 0,
  });

  return json(res, 200, { ok: true });
};
