const router = require('express').Router();
const { validateSignIn, validateSignUp } = require('../middlewares/validation');

const usersRouter = require('./users');
const movieRouter = require('./movies');
const notFoundRouter = require('./not-found');
const { login, createUser } = require('../controllers/users');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);

router.use(usersRouter, movieRouter, notFoundRouter);

module.exports = router;
