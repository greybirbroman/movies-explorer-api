const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validateMovie,
  validateMovieId,
} = require('../middlewares/validation');

router.get('/movies', auth, getMovies);
router.post('/movies', validateMovie, auth, createMovie);
router.delete('/movies/:movieId', validateMovieId, auth, deleteMovie);

module.exports = router;
