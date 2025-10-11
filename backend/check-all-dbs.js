const { MongoClient } = require('mongodb');

async function checkAllDatabases() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    // List all databases
    const adminDb = client.db('admin');
    const dbList = await adminDb.admin().listDatabases();
    
    console.log('\n📚 All databases:');
    for (const dbInfo of dbList.databases) {
      console.log(`  - ${dbInfo.name}`);
      
      // Check each database for collections with name indexes
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      
      for (const collection of collections) {
        try {
          const indexes = await db.collection(collection.name).indexes();
          const nameIndexes = indexes.filter(index => 
            Object.keys(index.key).some(key => key === 'name')
          );
          
          if (nameIndexes.length > 0) {
            console.log(`    📍 ${collection.name} has name indexes:`, nameIndexes);
          }
        } catch (error) {
          // Skip collections that can't be accessed
        }
      }
    }

  } catch (error) {
    console.error('❌ Error checking databases:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

checkAllDatabases();

