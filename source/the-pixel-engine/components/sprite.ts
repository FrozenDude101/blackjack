abstract class Sprite extends Component {

    public zIndex: number;

    constructor(args: Kwargs<typeof Component, {zIndex?: number}>) {
        super(args);
        if (!args.zIndex) args.zIndex = 0;

        this.zIndex = args.zIndex;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
}

class ImageSprite extends Sprite {

    protected readonly image: ImageResource;
    protected readonly anchor: Vector2;

    constructor(args: Kwargs<typeof Sprite, {path: string, groupName?: string, anchor?: Vector2}>) {
        super(args);
        if (!args.anchor) args.anchor = Anchor.CENTRE;

        this.image = ResourceLoader.loadImage(args.path, args.groupName);
        this.anchor = args.anchor;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.image.status !== Resource.STATUS.READY)
            return;
        let image = this.image.get();
        ctx.drawImage(image, -image.width * this.anchor.x, -image.height * this.anchor.y);
    }

}

class TextSprite extends Sprite {

    protected readonly text: string;
    protected readonly anchor: Vector2;

    constructor(args: Kwargs<typeof Sprite, {text: string, anchor?: Vector2}>) {
        super(args);
        if (!args.anchor) args.anchor = Anchor.CENTRE;

        this.text = args.text;
        this.anchor = args.anchor;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        let textMetrics = ctx.measureText(this.text);
        let width = textMetrics.width;
        let height = textMetrics.hangingBaseline - textMetrics.ideographicBaseline;
        ctx.fillText(this.text, -width * this.anchor.x, -height * (-1 + this.anchor.y));
    }

}