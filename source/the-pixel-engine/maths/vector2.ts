class Vector2 {

    public static readonly ZERO = new Vector2(0, 0);
    public static readonly ONE  = new Vector2(1, 1);

    public readonly x: number;
    public readonly y: number;

    public get length() { return Math.sqrt(this.x ** 2 + this.y ** 2); }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public toVector3() {
        return new Vector3(this.x, this.y, 1);
    }

    private map(that: number | Vector2, func: (a: number, b: number) => number): Vector2 {
        if (typeof that === "number")
            that = new Vector2(that, that);
        return new Vector2(func(this.x, that.x), func(this.y, that.y));
    }
    private all(that: number | Vector2, func: (a: number, b: number) => boolean): boolean {
        if (typeof that === "number")
            that = new Vector2(that, that);
        return func(this.x, that.x) && func(this.y, that.y);
    }
    
    public add(that: number | Vector2): Vector2 { return this.map(that, (a, b) => a+b); }
    public sub(that: number | Vector2): Vector2 { return this.map(that, (a, b) => a-b); }
    public mul(that: number | Vector2): Vector2 { return this.map(that, (a, b) => a*b); }
    public div(that: number | Vector2): Vector2 { return this.map(that, (a, b) => a/b); }

    public eq (that: Vector2): boolean { return this.all(that, (a, b) => a === b); }
    public gt (that: Vector2): boolean { return this.all(that, (a, b) => a > b); }
    public gte(that: Vector2): boolean { return this.all(that, (a, b) => a >= b); }
    public lt (that: Vector2): boolean { return this.all(that, (a, b) => a < b); }
    public lte(that: Vector2): boolean { return this.all(that, (a, b) => a <= b); }

}