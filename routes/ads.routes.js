const express = require('express');
const router = express.Router();
const imageUpload = require('../utils/imageUpload');
const adsController = require('../controllers/ads.controller');
const authMiddleware = require('../utils/authMiddleware');

router.post(
  '/ads',
  authMiddleware,
  imageUpload.single('photo'),
  adsController.create
);

router.put(
  '/ads/:id',
  authMiddleware,
  imageUpload.single('photo'),
  adsController.edit
);

router.get('/ads', adsController.getAll);

router.get('/ads/:id', adsController.getById);

router.get('/ads/search/:searchPhrase', adsController.getBySearchPhrase);

router.delete('/ads/:id', authMiddleware, adsController.delete);

module.exports = router;
