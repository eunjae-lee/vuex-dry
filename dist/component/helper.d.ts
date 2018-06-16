export declare function get(type: string, nestedPath?: string): () => any;
export declare function action(type: string): (payload?: any) => any;
export declare function sync(type: string, nestedPath?: string): {
    get(): any;
    set(value: any): void;
};
