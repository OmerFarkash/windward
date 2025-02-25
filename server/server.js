// server.js
const express = require('express');
const cors = require('cors');
const { loadData } = require('./dataLoader');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3001;

app.use(cors());

// Basic root route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Mount API routes
app.use('/api', apiRoutes);

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