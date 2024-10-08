import AbstractDatabase from "../lib/AbstractDatabase";
export default class Rusty_db extends AbstractDatabase {
    db: any | null | undefined;
    constructor(settings: {
        filename: string;
    });
    get isAsync(): boolean;
    findKeys(key: string, notKey?: string): any;
    get(key: string): any;
    init(): Promise<void>;
    close(): void;
    remove(key: string): void;
    set(key: string, value: string): void;
    destroy(): void;
}
//# sourceMappingURL=rusty_db.d.ts.map