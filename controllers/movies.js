const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const { STATUS_CREATED } = require('../utils/constants');

// GET /movies Возвращаем: все сохраненные пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

// POST /movies Создаем фильм и передаем в теле данные
module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(STATUS_CREATED).send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};
// DELETE /movies/_id Удалим сохраненный фильм по ID
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильма с таким ID не найдено');
      }
      if (JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)) {
        throw new ForbiddenError('Невозможно удалить');
      }
      return Movie.findByIdAndRemove(req.params.movieId);
    })
    .then((movie) => res.send({ data: movie }))
    .catch(next);
};
