// api/getData.js

const { MongoClient } = require("mongodb");

// The connection string will be provided via an environment variable (MONGODB_URI)
const uri = process.env.MONGODB_URI;

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  cachedClient = client;
  return client;
}

exports.handler = async function(event, context) {
  try {
    const client = await connectToDatabase();
    const db = client.db("familyTree"); // Use your DB name
    const collection = db.collection("people"); // Use your collection name
    const data = await collection.find({}).toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Database connection error" })
    };
  }
};

export default function handler(req, res) {
  res.status(200).json({ status: "ok" });
}
