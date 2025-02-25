// controllers/fleetController.js
const fleetService = require('../services/fleetService');

const getFleets = (req, res) => {
  try {
    const fleets = fleetService.getAllFleets();
    res.json(fleets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFleetVessels = (req, res) => {
  try {
    const { fleetName } = req.params;
    const fleetVessels = fleetService.getFleetVessels(fleetName);
    
    if (!fleetVessels) {
      return res.status(404).json({ error: `Fleet '${fleetName}' not found` });
    }
    
    res.json(fleetVessels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFleets,
  getFleetVessels
};