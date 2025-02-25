// server.js
const express = require('express');
const cors = require('cors');
const { loadData, dataStore } = require('./dataLoader');

const app = express();
const PORT = 3001;
app.use(cors());

// Create an API router with /api prefix
const apiRouter = express.Router();

// Basic root route (outside the /api prefix)
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Route for reading fleets with basic info under /api
apiRouter.get('/fleets', (req, res) => {
  const fleetInfo = dataStore.fleets.map(fleet => ({
    name: fleet.name,
    vesselsCount: fleet.vessels.length
  }));
  res.json(fleetInfo);
});

// Route for reading vessels of a specific fleet
apiRouter.get('/fleets/:fleetName/vessels', (req, res) => {
  const { fleetName } = req.params;
  
  // Find the fleet by name
  const fleet = dataStore.fleets.find(f => f.name === fleetName);
  
  if (!fleet) {
    return res.status(404).json({ 
      error: `Fleet '${fleetName}' not found` 
    });
  }

  // Get full vessel details for each vessel in the fleet
  const vessels = fleet.vessels
    .map(fleetVessel => {
      // Find vessel by _id in vesselsArray
      const vessel = dataStore.vesselsArray.find(v => v._id === fleetVessel._id);
      
      if (!vessel) {
        console.warn(`Vessel with ID ${fleetVessel._id} not found in fleet ${fleet.name}`);
        return null;
      }

      // Get the latest location for this vessel
      const location = dataStore.vesselLocations.find(loc => loc.mmsi === vessel.mmsi);

      // Return the full vessel data along with fleet-specific value and location
      return {
        ...vessel, // Spread all vessel properties
        value: fleetVessel.value, // Add the fleet-specific value
        location: location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: location.timestamp
        } : null
      };
    })
    .filter(vessel => vessel !== null); // Remove any null entries (vessels not found)

  res.json({
    fleetName: fleet.name,
    vessels: vessels
  });
});

// Mount the API router at /api
app.use('/api', apiRouter);

async function startServer() {
  try {
    await loadData();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server due to data loading error:', error.message);
    process.exit(1);
  }
}

startServer();