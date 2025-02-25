// services/fleetService.js
const { dataStore } = require('../dataLoader');
const vesselService = require('./vesselService');

const getAllFleets = () => {
  return dataStore.fleets.map(fleet => ({
    name: fleet.name,
    vesselsCount: fleet.vessels.length
  }));
};

const getFleetVessels = (fleetName) => {
  const fleet = dataStore.fleets.find(f => f.name === fleetName);
  
  if (!fleet) {
    return null;
  }

  const vessels = fleet.vessels
    .map(fleetVessel => {
      const vessel = vesselService.getVesselById(fleetVessel._id);
      
      if (!vessel) {
        console.warn(`Vessel with ID ${fleetVessel._id} not found in fleet ${fleet.name}`);
        return null;
      }

      return {
        ...vessel,
        value: fleetVessel.value,
        location: vesselService.getVesselLocation(vessel.mmsi)
      };
    })
    .filter(vessel => vessel !== null);

  return {
    fleetName: fleet.name,
    vessels
  };
};

module.exports = {
  getAllFleets,
  getFleetVessels
};