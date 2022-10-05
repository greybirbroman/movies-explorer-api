const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getProfile,
  updateProfile,
} = require('../controllers/users');

const { validateUser } = require('../middlewares/validation');

router.get('/users/me', auth, getProfile);
router.patch('/users/me', auth, validateUser, updateProfile);

module.exports = router;
