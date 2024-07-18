type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

function NTuple<T,N extends number>(n: N, value: T): Tuple<T,N> {
    let tuple = new Array(n).fill(value);
    assert(isNTuple(n, tuple));
    return tuple;
}
function isNTuple<T,N extends number>(n: N, values: T[]): values is Tuple<T,N> {
    return values.length === n;
}
function MxNTuple<T,M extends number, N extends number>(rows: M, cols: N, value: T): Tuple<Tuple<T, N>, M> {
    let tuple = new Array(rows).fill(value).map(r => NTuple(cols, value));
    assert(isNTuple(rows, tuple));
    return tuple;
}
function isMxNTuple<T,M extends number, N extends number>(rows: M, cols: N, values: T[][]): values is Tuple<Tuple<T, N>, M> {
    return isNTuple(rows, values) && values.every(v => isNTuple(cols, v));
}