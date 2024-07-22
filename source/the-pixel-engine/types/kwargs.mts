export type Kwargs<T extends abstract new (...args: any) => any, A extends object = {}> =
    T extends infer U ? U extends (abstract new (...args: any) => any) ?
        Expand<ConstructorParameters<U>[0] & A>
    : A : never;

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;