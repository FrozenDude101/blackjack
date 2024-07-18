class Button extends TextSprite {

    private mouseTrigger?: RectMouseTrigger;
    private fillColour = "darkgray";
    private onClick?: () => void;

    constructor(args: Kwargs<typeof TextSprite, {
        onClick?: () => void
    }>) {
        super(args);

        this.onClick = args.onClick;
    }

    public onMouseIn() {
        this.fillColour = "lightgray";
    }
    public onMouseOut() {
        this.fillColour = "darkgray";
    }
    public onMouseClick() {
        this.onClick?.();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        let textMetrics = ctx.measureText(this.text);
        let width = textMetrics.width;
        let height = textMetrics.hangingBaseline - textMetrics.ideographicBaseline;

        width += 10;
        height += 10;

        if (!this.mouseTrigger)
            this.mouseTrigger = this.addChild(RectMouseTrigger, {
                width: width, height: height,
                onMouseIn: () => this.onMouseIn(),
                onMouseOut: () => this.onMouseOut(),
                onMouseClick: () => this.onMouseClick(),
            });

        ctx.save();
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(-width/2, -height/2, width, height);
        ctx.restore();

        super.draw(ctx);
    }

}