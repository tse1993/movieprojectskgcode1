require('dotenv').config();
const { connectDB, getDB } = require('./src/config/db');

async function testDatabase() {
  try {
    console.log('🔄 Testing MongoDB connection...\n');

    // Connect to database
    await connectDB();
    const db = getDB();

    // Test 1: Ping database
    console.log('Test 1: Ping Database');
    await db.command({ ping: 1 });
    console.log('✅ Ping successful\n');

    // Test 2: List collections
    console.log('Test 2: List Collections');
    const collections = await db.listCollections().toArray();
    console.log('📦 Collections:', collections.map(c => c.name).join(', ') || 'None yet');
    console.log('');

    // Test 3: Insert test document
    console.log('Test 3: Insert Test Document');
    const testCollection = db.collection('test');
    const insertResult = await testCollection.insertOne({
      test: true,
      message: 'Test document',
      timestamp: new Date()
    });
    console.log('✅ Document inserted with ID:', insertResult.insertedId);
    console.log('');

    // Test 4: Query test document
    console.log('Test 4: Query Test Document');
    const document = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('✅ Document retrieved:', document);
    console.log('');

    // Test 5: Delete test document
    console.log('Test 5: Delete Test Document');
    const deleteResult = await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Document deleted:', deleteResult.deletedCount, 'document(s)');
    console.log('');

    // Test 6: Check users collection exists
    console.log('Test 6: Check Users Collection');
    const userCount = await db.collection('users').countDocuments();
    console.log('👥 Users in database:', userCount);

    console.log('\n✅ All database tests passed!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testDatabase();
