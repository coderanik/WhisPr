require('dotenv').config();
const mongoose = require('mongoose');

async function fixProductionDatabase() {
  try {
    console.log('🔄 Connecting to production MongoDB...');
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is required');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to production MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // List all indexes
    console.log('📋 Current indexes on users collection:');
    const indexes = await usersCollection.indexes();
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${JSON.stringify(index.key)} - ${index.name}`);
    });

    // Check if there's a problematic 'name' index and drop it
    const nameIndex = indexes.find(index => index.key.name !== undefined);
    if (nameIndex) {
      console.log('⚠️  Found problematic "name" index, dropping it...');
      try {
        await usersCollection.dropIndex('name_1');
        console.log('✅ Dropped "name_1" index');
      } catch (error) {
        console.log('⚠️  Could not drop name_1 index:', error.message);
      }
    }

    // Check if there are any documents with a 'name' field and remove it
    console.log('🔍 Checking for documents with "name" field...');
    const documentsWithName = await usersCollection.find({ name: { $exists: true } }).toArray();
    
    if (documentsWithName.length > 0) {
      console.log(`⚠️  Found ${documentsWithName.length} documents with "name" field, removing it...`);
      await usersCollection.updateMany(
        { name: { $exists: true } },
        { $unset: { name: 1 } }
      );
      console.log('✅ Removed "name" field from all documents');
    }

    // Ensure the correct indexes exist
    console.log('🔧 Ensuring correct indexes exist...');
    
    try {
      await usersCollection.createIndex({ anonymousName: 1 }, { unique: true });
      console.log('✅ Created unique index on anonymousName');
    } catch (error) {
      console.log('⚠️  anonymousName index already exists or error:', error.message);
    }

    try {
      await usersCollection.createIndex({ regNoHash: 1 }, { unique: true });
      console.log('✅ Created unique index on regNoHash');
    } catch (error) {
      console.log('⚠️  regNoHash index already exists or error:', error.message);
    }

    // List indexes again to confirm
    console.log('📋 Final indexes on users collection:');
    const finalIndexes = await usersCollection.indexes();
    finalIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${JSON.stringify(index.key)} - ${index.name}`);
    });

    // Count documents to verify data integrity
    const totalUsers = await usersCollection.countDocuments();
    console.log(`📊 Total users in database: ${totalUsers}`);

    console.log('✅ Production database fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing production database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the fix
fixProductionDatabase();
