const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../utils/authMiddleware');

const imageUpload = require('../utils/imageUpload');

router.post('/register', imageUpload.single('avatar'), authController.register);

router.post('/login', authController.login);

router.get('/user', authMiddleware, authController.getUser);

router.delete('/logout', authMiddleware, authController.logout);

module.exports = router;
