// routes/api.js
const express = require('express');
const router = express.Router();
const fleetController = require('../controllers/fleetController');
const vesselController = require('../controllers/vesselController');

// Fleet routes
router.get('/fleets', fleetController.getFleets);
router.get('/fleets/:fleetName/vessels', fleetController.getFleetVessels);

// Vessel routes
router.get('/vessels/search', vesselController.searchVessels);

module.exports = router;