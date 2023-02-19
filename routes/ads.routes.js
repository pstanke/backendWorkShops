const express = require('express');
const router = express.Router();

const adsController = require('../controllers/ads.controller');

router.get('/ads', adsController.getAll);

router.get('/ads/:id', adsController.getById);

router.get('/ads/search/:searchPhrase', adsController.getBySearchPhrase);

router.post('/ads', adsController.create);

router.put('/ads/:id', adsController.edit);

router.delete('/ads/:id', adsController.delete);

module.exports = router;
