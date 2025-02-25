// dataLoader.js
const fs = require('fs').promises;
const path = require('path');

// Paths to JSON files
const DATA_DIR = './data';
const VESSELS_FILE = path.join(DATA_DIR, 'vessels.json');
const FLEETS_FILE = path.join(DATA_DIR, 'fleets.json');
const LOCATIONS_FILE = path.join(DATA_DIR, 'vesselLocations.json');

// In-memory data store
const dataStore = {
  vessels: new Map(), // For fast lookups by MMSI
  vesselsArray: [],   // For sorted vessels
  fleets: [],
  vesselLocations: []
};

async function loadData() {
  try {
    // Read and parse vessels.json
    const vesselsData = await fs.readFile(VESSELS_FILE, 'utf8');
    const vessels = JSON.parse(vesselsData);

    // Index vessels by MMSI into the Map
    vessels.forEach(vessel => {
      if (vessel.mmsi) {
        dataStore.vessels.set(vessel.mmsi, vessel);
      } else {
        console.warn(`Vessel missing MMSI: ${JSON.stringify(vessel)}`);
      }
    });

    // Sort vessels by name, then flag, then mmsi (handle missing fields)
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

    // Read and parse fleets.json
    const fleetsData = await fs.readFile(FLEETS_FILE, 'utf8');
    dataStore.fleets = JSON.parse(fleetsData);

    // Optionally load vesselLocations.json
    const locationsData = await fs.readFile(LOCATIONS_FILE, 'utf8');
    dataStore.vesselLocations = JSON.parse(locationsData);

  } catch (error) {
    console.error('Error loading data:', error.message);
    throw error;
  }
}

module.exports = { dataStore, loadData };