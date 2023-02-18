const express = require('express');
const router = express.Router();

const AdsController = require('../controllers/ads.controller');

router.get('/ads', AdsController.getAll);

router.get('/ads/:id', AdsController.getById);

router.get('/ads/search/:searchPhrase', AdsController.getBySearchPhrase);

router.post('/ads', AdsController.create);

router.put('/ads/:id', AdsController.edit);

router.delete('/ads/:id', AdsController.delete);

module.exports = router;
