// dataLoader.js remains mostly the same, just remove the console.log statements
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = './data';
const VESSELS_FILE = path.join(DATA_DIR, 'vessels.json');
const FLEETS_FILE = path.join(DATA_DIR, 'fleets.json');
const LOCATIONS_FILE = path.join(DATA_DIR, 'vesselLocations.json');

const dataStore = {
  vessels: new Map(),
  vesselsArray: [],
  fleets: [],
  vesselLocations: []
};

async function loadData() {
  try {
    const vesselsData = await fs.readFile(VESSELS_FILE, 'utf8');
    const vessels = JSON.parse(vesselsData);

    vessels.forEach(vessel => {
      if (vessel.mmsi) {
        dataStore.vessels.set(vessel.mmsi, vessel);
      }
    });

    dataStore.vesselsArray = vessels.sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      if (nameA !== nameB) return nameA.localeCompare(nameB);

      const flagA = a.flag || '';
      const flagB = b.flag || '';
      if (flagA !== flagB) return flagA.localeCompare(flagB);

      const mmsiA = a.mmsi ? a.mmsi.toString() : '';
      const mmsiB = b.mmsi ? b.mmsi.toString() : '';
      return mmsiA.localeCompare(mmsiB);
    });

    const fleetsData = await fs.readFile(FLEETS_FILE, 'utf8');
    dataStore.fleets = JSON.parse(fleetsData);

    const locationsData = await fs.readFile(LOCATIONS_FILE, 'utf8');
    dataStore.vesselLocations = JSON.parse(locationsData);

  } catch (error) {
    console.error('Error loading data:', error.message);
    throw error;
  }
}

module.exports = { dataStore, loadData };