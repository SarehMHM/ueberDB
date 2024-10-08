import AbstractDatabase, { Settings } from '../lib/AbstractDatabase';
import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, ResourceNotFoundException } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

import dotenv from 'dotenv';

dotenv.config();

interface DynamoDBSettings extends Settings {
  aws?: {
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };
  tableName?: string;
}

export default class extends AbstractDatabase{
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(settings: DynamoDBSettings) {
    super(settings);
    const awsConfig = {
      region: settings.aws?.region || process.env.AWS_REGION,
      credentials: {
        accessKeyId: settings.aws?.accessKeyId || process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: settings.aws?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    };

    this.client = new DynamoDBClient(awsConfig);
    this.docClient = DynamoDBDocumentClient.from(this.client);
    this.tableName = settings.tableName || process.env.DYNAMODB_TABLE || 'ueber';
  }

  async init(): Promise<void> {
    try {
      const describeCommand = new DescribeTableCommand({ TableName: this.tableName });
      await this.client.send(describeCommand);
      this.logger.info(`Table ${this.tableName} exists.`);
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        const createCommand = new CreateTableCommand({
          TableName: this.tableName,
          KeySchema: [{ AttributeName: 'key', KeyType: 'HASH' }],
          AttributeDefinitions: [{ AttributeName: 'key', AttributeType: 'S' }],
          BillingMode: 'PAY_PER_REQUEST', // Use on-demand capacity mode
        });
        await this.client.send(createCommand);
        this.logger.info(`Table ${this.tableName} created successfully.`);
      } else {
        this.logger.error('Error in init operation:', error);
        throw error;
      }
    }
  }

  async get(key: string): Promise<any> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { key }
    });

    try {
      const result = await this.docClient.send(command);
      return result.Item ? result.Item.value : null;
    } catch (error) {
      this.logger.error('Error in get operation:', error);
      throw error;
    }
  }

  async findKeys(key: string, notKey?: string): Promise<string[]> {
    const regex = this.createFindRegex(key, notKey);
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'attribute_exists(#k)',
      ExpressionAttributeNames: { '#k': 'key' },
    });

    try {
      const result = await this.docClient.send(command);
      return result.Items
        ?.map(item => item.key as string)
        .filter(k => regex.test(k)) || [];
    } catch (error) {
      this.logger.error('Error in findKeys operation:', error);
      throw error;
    }
  }

  async set(key: string, value: any): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: { key, value }
    });

    try {
      await this.docClient.send(command);
    } catch (error) {
      this.logger.error('Error in set operation:', error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { key }
    });

    try {
      await this.docClient.send(command);
    } catch (error) {
      this.logger.error('Error in remove operation:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    // DynamoDB doesn't require explicit connection closing
  }

  async doBulk(operations: Array<{type: string, key: string, value?: any}>): Promise<void> {
    for (const op of operations) {
      switch (op.type) {
        case 'set':
          await this.set(op.key, op.value);
          break;
        case 'remove':
          await this.remove(op.key);
          break;
        default:
          throw new Error(`Unknown bulk operation type: ${op.type}`);
      }
    }
  }

  get isAsync(): boolean { return true; }
};

