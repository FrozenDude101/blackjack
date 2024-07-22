import { assert } from "../types/assert.mjs";
import { Tuple } from "../types/nTuple.mjs";
import { Matrix3 } from "./matrix3.mjs";
import { Vector2 } from "./vector2.mjs";


export class Transform {

    public static readonly IDENTITY = new Transform(Matrix3.IDENTITY);

    public get x():  number { return this.m.values[0][2]; }
    public get y():  number { return this.m.values[1][2]; }
    public get r():  number { return Math.atan2(this.m.values[1][0], this.m.values[1][1]); }
    public get sx(): number { return Math.sqrt(this.m.values[0][0] ** 2 + this.m.values[0][1] ** 2); }
    public get sy(): number { return Math.sqrt(this.m.values[1][0] ** 2 + this.m.values[1][1] ** 2); }

    public get abcdef(): Tuple<number, 6> { return [
        this.m.values[0][0], this.m.values[1][0], this.m.values[0][1],
        this.m.values[1][1], this.m.values[0][2], this.m.values[1][2],
    ]}

    private readonly _m: Matrix3;
    public get m(): Matrix3 { return this._m; }

    constructor(m: Matrix3) {
        this._m = m;
    }
    public static from({x = 0, y = 0, r = 0, sx = 1, sy = 1}): Transform {
        return new Transform(new Matrix3([
                [sx*Math.cos(r), sx*-Math.sin(r), x],
                [sy*Math.sin(r), sy* Math.cos(r), y],
                [             0,               0, 1],
        ]));
    }

    public toGlobal(v: Vector2): Vector2 {
        return this.m.mul(v.toVector3()).toVector2();
    }
    public toLocal(v: Vector2): Vector2 {
        return this.m.inverse.mul(v.toVector3()).toVector2();
    }

    public mul(t: Transform): Transform {
        return new Transform(this.m.mul(t.m));
    }

    public inverse(): Transform {
        return new Transform(this.m.inverse);
    }

    public static translation(x: number, y: number): Transform;
    public static translation(v: Vector2): Transform;
    public static translation(x: number | Vector2, y?: number): Transform {
        if (x instanceof Vector2)
            return Transform.from({x: x.x, y: x.y});
        assert(y !== undefined);
        return Transform.from({x: x, y: y});
    }
    public translate(x: number, y: number): Transform;
    public translate(v: Vector2): Transform;
    public translate(x: number | Vector2, y?: number): Transform {
        if (x instanceof Vector2)
            return this.mul(Transform.translation(x));
        assert(y !== undefined);
        return this.mul(Transform.translation(x, y));
    }

    public static rotation(r: number) {
        return Transform.from({r: r});
    }
    public rotate(r: number): Transform {
        return this.mul(Transform.rotation(r));
    }

    public static scale(s: number): Transform;
    public static scale(x: number, y: number): Transform;
    public static scale(v: Vector2): Transform;
    public static scale(x: number | Vector2, y?: number): Transform {
        if (x instanceof Vector2)
            return Transform.from({sx: x.x, sy: x.y});
        if (y === undefined)
            return Transform.from({sx: x, sy: x});
        return Transform.from({sx: x, sy: y});
    }
    public scale(s: number): Transform;
    public scale(x: number, y: number): Transform;
    public scale(v: Vector2): Transform;
    public scale(x: number | Vector2, y?: number): Transform {
        if (x instanceof Vector2)
            return this.mul(Transform.scale(x));
        if (y === undefined)
            return this.mul(Transform.scale(x));
        return this.mul(Transform.scale(x, y));
    }

}