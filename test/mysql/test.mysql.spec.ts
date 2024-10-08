import { afterAll, beforeAll, describe } from 'vitest';
import { test_db } from '../lib/test_lib';
import 'dotenv/config';

describe('dynamodb test', () => {
  beforeAll(async () => {
    // Set environment variables for connecting to DynamoDB on AWS
    process.env.AWS_REGION = process.env.AWS_REGION || 'us-east-1';
    process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'your_access_key_id';
    process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'your_secret_access_key';
    process.env.DYNAMODB_TABLE = process.env.DYNAMODB_TABLE || 'ueberdb_test';

    // Since we're connecting directly to AWS, no container needs to be started here
  });

  // Run the standard database tests for DynamoDB
  test_db('dynamodb');

  afterAll(async () => {
    // No container to stop in this case
  });
}, 120000);
