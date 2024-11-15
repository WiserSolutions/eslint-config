const { MongoClient } = require('mongodb');

async function connectToDb() {
  const client = new MongoClient('mongodb://localhost:27017');
  return client.connect();
}

