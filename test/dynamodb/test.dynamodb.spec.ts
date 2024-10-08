import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { test_db } from '../lib/test_lib';

describe('dynamodb test', () => {
    let client: DynamoDBClient;
    let docClient: DynamoDBDocumentClient;

    beforeAll(() => {
        client = new DynamoDBClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
            },
            maxAttempts: 3,
        });
        docClient = DynamoDBDocumentClient.from(client);
    });

    test_db('dynamodb');

    afterAll(async () => {
        await client.destroy();
    });

    it('should connect to DynamoDB', async () => {
        expect(client).toBeDefined();
        expect(docClient).toBeDefined();
    });
});