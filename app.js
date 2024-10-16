// Import required modules
const express = require('express');
const { MongoClient } = require('mongodb');

// Create Express app
const app = express();
const port = 3000;

// MongoDB (Cosmos DB) connection string and database configuration
const mongoURI = "your-cosmosdb-connection-string"; // Replace with your Cosmos DB connection string
const databaseName = "your-database-name"; // Replace with your Cosmos DB database name
const collectionName = "your-collection-name"; // Replace with your Cosmos DB collection name

// Global variable for MongoDB client
let dbClient;

// Function to connect to Cosmos DB
async function connectToCosmosDB() {
  try {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    dbClient = client.db(databaseName);
    console.log('Connected to Cosmos DB');
  } catch (err) {
    console.error('Failed to connect to Cosmos DB:', err);
  }
}

// Health check endpoint to check API and DB connectivity
app.get('/health', async (req, res) => {
  try {
    // Check the connection to the Cosmos DB
    if (!dbClient) {
      return res.status(500).json({ message: 'Cosmos DB connection not established' });
    }

    // Perform a simple read operation from Cosmos DB collection
    const collection = dbClient.collection(collectionName);
    const document = await collection.findOne();

    if (document) {
      res.status(200).json({ message: 'API is healthy', cosmosData: document });
    } else {
      res.status(200).json({ message: 'API is healthy, but no data found in Cosmos DB' });
    }
  } catch (err) {
    console.error('Error during health check:', err);
    res.status(500).json({ message: 'Error connecting to Cosmos DB', error: err });
  }
});

// Other API endpoints (you can add more as needed)
app.get('/', (req, res) => {
  res.send('Welcome to the API connected to Cosmos DB');
});

// Start the Express server and connect to Cosmos DB
app.listen(port, async () => {
  console.log(`API listening on http://localhost:${port}`);
  await connectToCosmosDB(); // Connect to Cosmos DB when the server starts
});
