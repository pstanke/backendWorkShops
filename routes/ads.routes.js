const express = require('express');
const router = express.Router();
const imageUpload = require('../utils/imageUpload');
const adsController = require('../controllers/ads.controller');

router.post('/ads', imageUpload.single('photo'), adsController.create);

router.put('/ads/:id', imageUpload.single('photo'), adsController.edit);

router.get('/ads', adsController.getAll);

router.get('/ads/:id', adsController.getById);

router.get('/ads/search/:searchPhrase', adsController.getBySearchPhrase);

router.delete('/ads/:id', adsController.delete);

module.exports = router;
