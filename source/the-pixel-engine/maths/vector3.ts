class Vector3 {

    public static readonly ZERO = new Vector3(0, 0, 0);
    public static readonly ONE  = new Vector3(1, 1, 1);

    public readonly x: number;
    public readonly y: number;
    public readonly z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    public toVector2() {
        return new Vector2(this.x, this.y);
    }

    private map(that: number | Vector3, func: (a: number, b: number) => number): Vector3 {
        if (typeof that === "number")
            that = new Vector3(that, that, that);
        return new Vector3(func(this.x, that.x), func(this.y, that.y), func(this.z, that.z));
    }

    public add(that: number | Vector3): Vector3 { return this.map(that, (a, b) => a+b); }
    public sub(that: number | Vector3): Vector3 { return this.map(that, (a, b) => a-b); }
    public mul(that: number | Vector3): Vector3 { return this.map(that, (a, b) => a*b); }
    public div(that: number | Vector3): Vector3 { return this.map(that, (a, b) => a/b); }

}