const express = require('express');
const router = express.Router();
const { getWeatherData } = require('../controllers/weatherController');

router.get('/:location', getWeatherData);

module.exports = router;
