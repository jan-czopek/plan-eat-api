const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401);
  } else {
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(
      token,
      process.env.ACCES_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          res.send(403);
        } else {
          req.user = decoded.userName;
          next();
        }
      }
    );
  }
}

module.exports = verifyJWT;