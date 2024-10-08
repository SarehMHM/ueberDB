import { Settings } from './lib/AbstractDatabase';
import Cassandra_db from './databases/cassandra_db';
import Couch_db from './databases/couch_db';
import Dirty_db from './databases/dirty_db';
import Dirty_git_db from './databases/dirty_git_db';
import Elasticsearch_db from './databases/elasticsearch_db';
import MemoryDB from './databases/memory_db';
import Mock_db from './databases/mock_db';
import Mongodb_db from './databases/mongodb_db';
import MSSQL from './databases/mssql_db';
import Mysql_db from './databases/mysql_db';
import Dynamodb_db from './databases/dynamodb_db';
import Postgres_db from './databases/postgres_db';
import RedisDB from './databases/redis_db';
import Rethink_db from './databases/rethink_db';
import SQLiteDB from './databases/sqlite_db';
import SurrealDB from './databases/surrealdb_db';
import Rusty_db from "./databases/rusty_db";
export type DatabaseType = 'mysql' | 'dynamodb' | 'postgres' | 'sqlite' | 'rustydb' | 'mongodb' | 'redis' | 'cassandra' | 'dirty' | 'dirtygit' | 'elasticsearch' | 'memory' | 'mock' | 'mssql' | 'postgrespool' | 'rethink' | 'couch' | 'surrealdb';
export declare class Database {
    readonly type: DatabaseType;
    readonly dbSettings: any;
    readonly wrapperSettings: any | {};
    readonly logger: Function | null;
    db: any;
    metrics: any;
    /**
     * @param type The type of the database
     * @param dbSettings The settings for that specific database type
     * @param wrapperSettings
     * @param logger Optional logger object. If no logger object is provided no logging will occur.
     *     The logger object is expected to be a log4js logger object or `console`. A logger object
     *     from another logging library should also work, but performance may be reduced if the logger
     *     object does not have is${Level}Enabled() methods (isDebugEnabled(), etc.).
     */
    constructor(type: undefined | DatabaseType, dbSettings: Settings | null | string, wrapperSettings?: null | {}, logger?: any);
    /**
     * @param callback - Deprecated. Node-style callback. If null, a Promise is returned.
     */
    init(callback?: null): any;
    initDB(): Mysql_db | Dynamodb_db | Postgres_db | SQLiteDB | Rusty_db | Mongodb_db | RedisDB | Cassandra_db | Dirty_db | Dirty_git_db | Elasticsearch_db | MemoryDB | Mock_db | MSSQL | Rethink_db | Couch_db | SurrealDB;
    /**
     * Wrapper functions
     */
    /**
     * Deprecated synonym of flush().
     *
     * @param callback - Deprecated. Node-style callback. If null, a Promise is returned.
     */
    doShutdown(callback?: null): any;
    /**
     * Writes any unsaved changes to the underlying database.
     *
     * @param callback - Deprecated. Node-style callback. If null, a Promise is returned.
     */
    flush(callback?: null): any;
    /**
     * @param key
     * @param callback - Deprecated. Node-style callback. If null, a Promise is returned.
     */
    get(key: string, callback?: null): any;
    /**
     * @param key
     * @param notKey
     * @param callback - Deprecated. Node-style callback. If null, a Promise is returned.
     */
    findKeys(key: string, notKey?: string, callback?: null): any;
    /**
     * Removes an entry from the database if present.
     *
     * @param key
     * @param cb Deprecated. Node-style callback. Called when the write has been committed to the
     *     underlying database driver. If null, a Promise is returned.
     * @param deprecated Deprecated callback that is called just after cb. Ignored if cb is null.
     */
    remove(key: string, cb?: null, deprecated?: null): any;
    /**
     * Adds or changes the value of an entry.
     *
     * @param key
     * @param value
     * @param cb Deprecated. Node-style callback. Called when the write has been committed to the
     *     underlying database driver. If null, a Promise is returned.
     * @param deprecated Deprecated callback that is called just after cb. Ignored if cb is null.
     */
    set(key: string, value: any, cb?: null, deprecated?: null): any;
    /**
     * @param key
     * @param sub
     * @param callback - Deprecated. Node-style callback. If null, a Promise is returned.
     */
    getSub(key: string, sub: string[], callback?: Function | null): any;
    /**
     * Adds or changes a subvalue of an entry.
     *
     * @param key
     * @param sub
     * @param value
     * @param cb Deprecated. Node-style callback. Called when the write has been committed to the
     *     underlying database driver. If null, a Promise is returned.
     * @param deprecated Deprecated callback that is called just after cb. Ignored if cb is null.
     */
    setSub(key: string, sub: string, value: string, cb?: Function | null, deprecated?: Function | null): any;
    /**
     * Flushes unwritten changes then closes the connection to the underlying database. After this
     * returns, any future call to a method on this object may result in an error.
     *
     * @param callback - Deprecated. Node-style callback. If null, a Promise is returned.
     */
    close(callback?: Function | null): any;
}
/**
 * Deprecated synonym of Database.
 */
export default Database;
//# sourceMappingURL=index.d.ts.map