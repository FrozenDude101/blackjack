type Kwargs<T extends abstract new (...args: any) => any, A extends object = {}> =
    T extends infer U ? U extends (abstract new (...args: any) => any) ?
        Expand<ConstructorParameters<U>[0] & A>
    : A : never;

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type SetupArgs<T extends new (args: any) => any> = 
    InstanceType<T> extends {setup: any} ?
        Parameters<InstanceType<T>["setup"]>
    : []

function assert(condition: any, msg?: string): asserts condition {
    if (!condition) {
        throw new Error(msg);
    }
}