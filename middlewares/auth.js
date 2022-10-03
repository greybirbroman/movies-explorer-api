const jwt = require('jsonwebtoken');

const DataError = require('../errors/unauthorised-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new DataError('Необходима авторизация!'));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // Верификация токена
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
  } catch (err) {
    next(new DataError('Необходима авторизация!'));
  }
  req.user = payload;
  next();
};
