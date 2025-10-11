const { MongoClient } = require('mongodb');

async function fixDatabase() {
  const uri = 'mongodb://localhost:27017/Whispr';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('Whispr');
    const usersCollection = db.collection('users');

    // Drop the old name index if it exists
    try {
      await usersCollection.dropIndex('name_1');
      console.log('✅ Dropped old name index');
    } catch (error) {
      if (error.code === 26) {
        console.log('ℹ️  No name index found to drop');
      } else {
        console.log('⚠️  Error dropping name index:', error.message);
      }
    }

    // Drop the entire users collection to start fresh
    try {
      await usersCollection.drop();
      console.log('✅ Dropped users collection');
    } catch (error) {
      console.log('⚠️  Error dropping collection:', error.message);
    }

    // Create new indexes for the updated schema
    await usersCollection.createIndex({ anonymousName: 1 }, { unique: true });
    await usersCollection.createIndex({ regNoHash: 1 }, { unique: true });
    
    console.log('✅ Created new indexes for anonymousName and regNoHash');
    console.log('✅ Database schema fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing database:', error);
  } finally {
    await client.close();
    console.log('✅ Database connection closed');
  }
}

fixDatabase();

