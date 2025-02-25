// controllers/vesselController.js
const vesselService = require('../services/vesselService');

const searchVessels = (req, res) => {
  try {
    const { name, flag, mmsi } = req.query;
    
    // Check if at least one search parameter is provided
    if (!name && !flag && !mmsi) {
      return res.status(400).json({ 
        error: 'At least one search parameter (name, flag, or mmsi) is required' 
      });
    }

    const vessels = vesselService.searchVessels({ name, flag, mmsi });
    res.json(vessels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  searchVessels
};