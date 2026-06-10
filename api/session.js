const { json, getAuthPayload } = require('./_utils');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const payload = getAuthPayload(req);
  if (!payload) {
    return json(res, 401, { ok: false });
  }

  return json(res, 200, { ok: true, user: payload.sub, exp: payload.exp });
};
