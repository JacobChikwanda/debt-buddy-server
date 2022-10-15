const jwt = require('jsonwebtoken');

function generateAccessToken(id) {
  return jwt.sign({id}, process.env.TOKEN_SECRET, { expiresIn: '6000s' });
}

module.exports = generateAccessToken;