import dotenv from 'dotenv';
import DynamoDBDatabase from '../../databases/dynamodb_db';

dotenv.config();

async function testDynamoDBConnection() {
  const db = new DynamoDBDatabase({
    aws: {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    tableName: process.env.DYNAMODB_TABLE_NAME || 'ueberdb-test'
  });

  try {
    await db.init();
    console.log('Successfully connected to DynamoDB and initialized the table');

    await db.set('testKey', 'testValue');
    console.log('Successfully set a test key-value pair');

    const value = await db.get('testKey');
    console.log('Retrieved value:', value);

    await db.remove('testKey');
    console.log('Successfully removed the test key');

    await db.close();
    console.log('Closed the database connection');
  } catch (error) {
    console.error('Error:', error);
  }
}

testDynamoDBConnection();