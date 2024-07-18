abstract class MouseTrigger extends Component {

    private readonly onMouseDownTrigger?:  (mousePos: Vector2) => void;
    private readonly onMouseUpTrigger?:    (mousePos: Vector2) => void;
    private readonly onMouseClickTrigger?: (mousePos: Vector2) => void;
    private readonly onMouseInTrigger?:    (mousePos: Vector2) => void;
    private readonly onMouseMoveTrigger?:  (mousePos: Vector2) => void;
    private readonly onMouseOutTrigger?:   (mousePos: Vector2) => void;

    private mouseDownInside = false;
    private mouseInside     = false;

    constructor(args: Kwargs<typeof Component, {
        onMouseDown?:  (mousePos: Vector2) => void,
        onMouseUp?:    (mousePos: Vector2) => void,
        onMouseClick?: (mousePos: Vector2) => void,
        onMouseIn?:    (mousePos: Vector2) => void,
        onMouseMove?:  (mousePos: Vector2) => void,
        onMouseOut?:   (mousePos: Vector2) => void,
    }>) {
        super(args);

        this.onMouseDownTrigger  = args.onMouseDown;
        this.onMouseUpTrigger    = args.onMouseUp;
        this.onMouseClickTrigger = args.onMouseClick;
        this.onMouseInTrigger    = args.onMouseIn;
        this.onMouseMoveTrigger  = args.onMouseMove;
        this.onMouseOutTrigger   = args.onMouseOut;
    }

    public onMouseDown(mousePos: Vector2) {
        let localMousePos = this.transform.toLocal(mousePos);
        if (this.contains(localMousePos)) {
            this.mouseDownInside = true;
            this.onMouseDownTrigger?.(localMousePos);
        } else {
            this.mouseDownInside = false;
        }
    }
    public onMouseUp(mousePos: Vector2) {
        let localMousePos = this.transform.toLocal(mousePos);
        if (this.contains(localMousePos)) {
            this.onMouseUpTrigger?.(localMousePos);
            if (this.mouseDownInside)
                this.onMouseClickTrigger?.(localMousePos);
        }
        this.mouseDownInside = false;
    }
    public onMouseMove(mousePos: Vector2) {
        let localMousePos = this.transform.toLocal(mousePos);
        let inside = this.contains(localMousePos);

        if (inside && !this.mouseInside)
            this.onMouseInTrigger?.(localMousePos);
        if (inside)
            this.onMouseMoveTrigger?.(localMousePos);
        if (!inside && this.mouseInside)
            this.onMouseOutTrigger?.(localMousePos);

        this.mouseInside = inside;
    }

    public abstract contains(mousePos: Vector2): boolean;

}

class RectMouseTrigger extends MouseTrigger {

    private readonly v1: Vector2;
    private readonly v2: Vector2;

    constructor(args: Kwargs<typeof MouseTrigger, {height: number, width: number}>) {
        super(args);

        this.v1 = new Vector2(-args.width/2, -args.height/2);
        this.v2 = new Vector2(args.width/2, args.height/2);
    }

    public contains(mousePos: Vector2): boolean {
        return mousePos.gt(this.v1) && mousePos.lt(this.v2);
    }

}

class CircleMouseTrigger extends MouseTrigger {

    private readonly radius: number;

    constructor(args: Kwargs<typeof MouseTrigger, {radius: number}>) {
        super(args);

        this.radius = args.radius;
    }

    public contains(mousePos: Vector2): boolean {
        return mousePos.length < this.radius;
    }

}