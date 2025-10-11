const { MongoClient } = require('mongodb');

async function resetDatabase() {
  const uri = 'mongodb://localhost:27017/Whispr';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('Whispr');
    
    // Drop the entire database
    await db.dropDatabase();
    console.log('✅ Dropped entire Whispr database');
    
    // Recreate the database
    const newDb = client.db('Whispr');
    const usersCollection = newDb.collection('users');
    
    // Create new indexes for the updated schema
    await usersCollection.createIndex({ anonymousName: 1 }, { unique: true });
    await usersCollection.createIndex({ regNoHash: 1 }, { unique: true });
    
    console.log('✅ Created new indexes for anonymousName and regNoHash');
    console.log('✅ Database completely reset successfully!');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    await client.close();
    console.log('✅ Database connection closed');
  }
}

resetDatabase();

