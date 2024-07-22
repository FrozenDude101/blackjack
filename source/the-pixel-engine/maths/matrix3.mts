import { assert } from "../types/assert.mjs";
import { Tuple, MxNTuple, isMxNTuple } from "../types/nTuple.mjs";
import { Vector3 } from "./vector3.mjs";

export class Matrix3 {
    
    public static IDENTITY = new Matrix3([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    public static ZEROS    = Matrix3.fill(0);
    public static ONES     = Matrix3.fill(1);

    private _values: Tuple<Tuple<number, 3>, 3>;
    public get values(): Readonly<Tuple<Readonly<Tuple<number, 3>>, 3>> { return this._values; }

    constructor(values: Tuple<Tuple<number, 3>, 3>) {
        this._values = values;
    }
    public static fill(n: number) {
        return new Matrix3([[n, n, n], [n, n, n], [n, n, n]]);
    }

    private map(that: number, func: (a: number, b: number) => number): Matrix3 {
        let values = MxNTuple(3, 3, 0);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                values[i][j] = func(this.values[i][j], that);
            }
        }
        
        return new Matrix3(values);
    }

    public add(that: number) { return this.map(that, (a,b) => a+b); }
    public sub(that: number) { return this.map(that, (a,b) => a-b); }
    public div(that: number) { return this.map(that, (a,b) => a/b); }

    public mul(that: number | Matrix3): Matrix3;
    public mul(that: Vector3): Vector3;
    public mul(that: number | Vector3 | Matrix3): Vector3 | Matrix3 {
        if (typeof that === "number")
            return this.map(that, (a,b) => a*b);

        if (that instanceof Vector3) {
            return new Vector3(
                this.values[0][0]*that.x +this.values[0][1]*that.y +this.values[0][2]*that.z,
                this.values[1][0]*that.x +this.values[1][1]*that.y +this.values[1][2]*that.z,
                this.values[2][0]*that.x +this.values[2][1]*that.y +this.values[2][2]*that.z,
            );
        }

        let values = MxNTuple(3, 3, 0);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    values[i][j] += this.values[i][k] * that.values[k][j];
                }
            }
        }
        return new Matrix3(values);
    }

    public equals(that: Matrix3) {
        return this.values.every((vs, i) => vs.every((v, j) => v === that.values[i][j]));
    }

    private _det?: number;
    public get det() {
        if (this._det)
            return this._det;

        let determinant = 
            + this.values[0][0] * (this.values[1][1]*this.values[2][2] - this.values[1][2]*this.values[2][1])
            - this.values[0][1] * (this.values[1][0]*this.values[2][2] - this.values[1][2]*this.values[2][0])
            + this.values[0][2] * (this.values[1][0]*this.values[2][1] - this.values[1][1]*this.values[2][0])

        this._det = determinant;
        return determinant;
    }
    private _transpose?: Matrix3;
    public get transpose() {
        if (this._transpose)
            return this._transpose;
        
        let values = MxNTuple(3, 3, 0);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                values[j][i] = this.values[i][j];
            }
        }

        let transpose = new Matrix3(values);
        transpose._transpose = this;
        this._transpose = transpose;
        return transpose;
    }
    private _inverse?: Matrix3;
    public get inverse() {
        if (this._inverse)
            return this._inverse;

        let values = this.values.map((vs, i) =>
            vs.map((_, j) =>
                this.values[(i+1)%3][(j+1)%3] * this.values[(i+2)%3][(j+2)%3] -
                this.values[(i+2)%3][(j+1)%3] * this.values[(i+1)%3][(j+2)%3]
        ));
        assert(isMxNTuple(3, 3, values));
        let cofactors = new Matrix3(values);
        
        let inverse = cofactors.transpose.div(this.det);
        inverse._inverse = this;
        this._inverse = inverse;
        return inverse;
    }

}