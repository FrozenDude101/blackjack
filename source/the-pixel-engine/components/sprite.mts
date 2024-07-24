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