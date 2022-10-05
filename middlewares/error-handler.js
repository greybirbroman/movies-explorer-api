const { SERVER_ERROR } = require('../utils/constants');

// Централизованная обработка ошибок
module.exports.errorHandler = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
};
