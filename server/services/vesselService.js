// services/vesselService.js
const { dataStore } = require('../dataLoader');

const searchVessels = (filters) => {
  const { name, flag, mmsi } = filters;

  return dataStore.vesselsArray.filter(vessel => {
    // Apply each filter if it exists (AND logic)
    const nameMatch = !name || (vessel.name && vessel.name.toLowerCase().includes(name.toLowerCase()));
    const flagMatch = !flag || (vessel.flag && vessel.flag.toLowerCase().includes(flag.toLowerCase()));
    const mmsiMatch = !mmsi || (vessel.mmsi && vessel.mmsi.toString().includes(mmsi));

    // All provided filters must match
    return nameMatch && flagMatch && mmsiMatch;
  });
};

const getVesselById = (vesselId) => {
  return dataStore.vesselsArray.find(v => v._id === vesselId);
};

const getVesselLocation = (mmsi) => {
  const location = dataStore.vesselLocations.find(loc => loc.mmsi === mmsi);
  if (!location) return null;
  
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    timestamp: location.timestamp
  };
};

module.exports = {
  searchVessels,
  getVesselById,
  getVesselLocation
};