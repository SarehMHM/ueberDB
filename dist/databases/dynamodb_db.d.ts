import AbstractDatabase, { Settings } from '../lib/AbstractDatabase';
interface DynamoDBSettings extends Settings {
    aws?: {
        region: string;
        accessKeyId?: string;
        secretAccessKey?: string;
    };
    tableName?: string;
}
export default class extends AbstractDatabase {
    private client;
    private docClient;
    private tableName;
    constructor(settings: DynamoDBSettings);
    init(): Promise<void>;
    get(key: string): Promise<any>;
    findKeys(key: string, notKey?: string): Promise<string[]>;
    set(key: string, value: any): Promise<void>;
    remove(key: string): Promise<void>;
    close(): Promise<void>;
    doBulk(operations: Array<{
        type: string;
        key: string;
        value?: any;
    }>): Promise<void>;
    get isAsync(): boolean;
}
export {};
//# sourceMappingURL=dynamodb_db.d.ts.map