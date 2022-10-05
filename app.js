const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/error-handler');
const { PORT, MONGO_DB, limiter } = require('./config');

const app = express();

app.use(helmet());

// Connection to database
mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
})
  .then(() => {
    console.log('Successfull connection to MongoDB');
  })
  .catch((err) => {
    console.log(`Error connection to MongoDB ${err}`);
  });

app.use(bodyParser.json());
// Для приема веб-страниц внутри POST запроса
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(requestLogger); // Подключаем логер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(limiter); // Установим Лимитер запросов
app.use(routes);

app.use(errorLogger); // Подключаем логер ошибок
app.use(errors()); // Оброботчик ошибок Celebrate
app.use(errorHandler); // Централизованная обработка ошибок
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
