import { ImageResource } from "../resources/resource.mjs";
import { ResourceLoader } from "../resources/resourceLoader.mjs";
import { Kwargs } from "../types/kwargs.mjs";
import { Component } from "./component.mjs";

export abstract class Sprite extends Component {

    zIndex: number;

    constructor(args: Kwargs<typeof Component, {zIndex?: number}> = {}) {
        super(args);
        if (args.zIndex === undefined) args.zIndex = 0;

        this.zIndex = args.zIndex;
    }

    public abstract whenRendered(ctx: CanvasRenderingContext2D): void
}

export class ImageSprite extends Sprite {

    private image: ImageResource;

    constructor(args: Kwargs<typeof Sprite, {path: string}>) {
        super(args);

        this.image = ResourceLoader.loadImage(args.path);
    }

    public whenRendered(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image.image, 0, 0);
    }

}