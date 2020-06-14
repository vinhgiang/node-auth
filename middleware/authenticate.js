const jwt = require('jsonwebtoken');

// check whether user has logged in or not
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  // decode JWT
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, jwt_auth) => {
    if (err) {
      return res.sendStatus(403);
    }

    // attach decoded JWT to request
    req.jwt_auth = jwt_auth;
    next();
  })
}

module.exports = authenticate;