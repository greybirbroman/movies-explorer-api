const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');

const checkUrl = (value, helpers) => {
  if (isUrl(value)) {
    return value;
  }
  return helpers.message('Incorrect URL');
};

const validateMovie = celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().integer().positive().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().positive().required(),
    year: Joi.string().required().pattern(/\d{4}/),
    description: Joi.string().required(),
    image: Joi.string().required().custom(checkUrl),
    trailerLink: Joi.string().required().custom(checkUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(checkUrl),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validateMovie,
  validateMovieId,
  validateUser,
  validateSignIn,
  validateSignUp,
};
