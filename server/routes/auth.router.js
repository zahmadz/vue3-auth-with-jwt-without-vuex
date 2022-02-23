const express = require('express');
const router = express.Router();

const {
  login,
  signup,
  verify,
  logout,
} = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/signup', signup);
router.get('/verify', verify);
router.get('/logout', logout);

module.exports = router;
