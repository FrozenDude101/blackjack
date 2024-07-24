import { Sprite } from "../the-pixel-engine/components/sprite.mjs";

export class BlackjackBackground extends Sprite {

    private TABLE_COLOUR = "#1e4532";
    private TABLE_DARK_COLOUR = "#1d362a";
    private WHITE = "#FFF"

    public whenRendered(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.TABLE_COLOUR;
        ctx.fillRect(0, 0, 320, 180);

        ctx.translate(160, -70);

        ctx.fillStyle = this.TABLE_DARK_COLOUR;
        ctx.beginPath();
        ctx.arc(0, 0, 160, 0, 2*Math.PI);
        ctx.fill();
        ctx.strokeStyle = this.WHITE;
        ctx.stroke();

        let r = 0.795;
        ctx.beginPath();
        ctx.arc(0, 0, 180, r+2*(Math.PI/2-r), r, true);
        ctx.lineTo(125.75, 128.5);
        r = 0.70;
        ctx.arc(0, 0, 200, r, r+2*(Math.PI/2-r));
        ctx.lineTo(-125.75, 128.5);
        ctx.fill();
        ctx.stroke();

        let w = 20 + 2;
        r = Math.PI/12;
        ctx.rotate(2*r);
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.rect(-w/2, 210, w, 28 + 2);
            ctx.fill();
            ctx.stroke();
            ctx.rotate(-r);
        }
    }

}