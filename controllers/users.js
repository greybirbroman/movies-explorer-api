const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorised-err');
const ExistError = require('../errors/exist-err');

const { STATUS_CREATED } = require('../utils/constants');

const { JWT_SECRET, NODE_ENV } = process.env;

// GET users/me - Возвращаем: email, name
module.exports.getProfile = (req, res, next) => User
  .findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    res.send({
      email: user.email,
      name: user.name,
      _id: user._id,
    });
  })
  .catch(next);
// PATCH users/me - Обновляем: email, name
module.exports.updateProfile = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else if (err.code === 11000) {
      next(new ExistError('Пользователь с такой почтой уже существует'));
    } else {
      next(err);
    }
  }
};
// SIGN-IN Вход в систему
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Неправильные почта или пароль'));
    });
};
// SIGN-UP Создание новой учетной записи
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10) // Хешируем пароль
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      res.status(STATUS_CREATED).send({
        name: user.name,
        email: user.email,
        _id: user._id, // Не отдаем пароль
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ExistError('Пользователь с такой почтой уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};
