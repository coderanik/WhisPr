const { MongoClient } = require('mongodb');

async function checkDatabase() {
  const uri = 'mongodb://localhost:27017/Whispr';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('Whispr');
    
    // Check all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Collections:', collections.map(c => c.name));

    // Check each collection for documents
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`📊 ${collection.name}: ${count} documents`);
      
      if (count > 0) {
        const sampleDoc = await db.collection(collection.name).findOne();
        console.log(`👤 Sample document from ${collection.name}:`);
        console.log(JSON.stringify(sampleDoc, null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

checkDatabase();
