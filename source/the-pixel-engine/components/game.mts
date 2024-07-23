import { Vector2 } from "../maths/vector2.mjs";
import { assert } from "../types/assert.mjs";
import { Component } from "./component.mjs";


export class Game extends Component {


    constructor() {
        super();

        let container = document.getElementById(this.CONTAINER_ID);
        if (!container) throw `Couldn't find an element with the ID ${this.CONTAINER_ID}.`;
        this.container = container;

        this.canvas = document.createElement("canvas");
        this.container.appendChild(this.canvas);
        this.refreshCanvasSize();
    }


    private CONTAINER_ID = "body";
    private CANVAS_SIZE  = new Vector2(320, 180);
    private NON_INTEGER_SCALING = false;

    private container: HTMLElement;
    private canvas: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private scale = 1;
    
    public refreshCanvasSize() {
        let scale = Math.min(
            this.container.offsetWidth  / this.CANVAS_SIZE.x,
            this.container.offsetHeight / this.CANVAS_SIZE.y,
        );
        if (!this.NON_INTEGER_SCALING)
            scale = Math.floor(scale);
        this.scale = scale;

        this.canvas.width = this.CANVAS_SIZE.x * this.scale;
        this.canvas.height = this.CANVAS_SIZE.y * this.scale;

        let ctx = this.canvas.getContext("2d");
        if (!ctx) throw `Failed to retrieve canvas context.`;
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = false;
    }


    private static components: Map<string, Component> = new Map();
    public static registerComponent(component: Component, id?: string): string {
        if (!id) id = component.constructor.name;

        if (this.components.has(id)) {
            let n = 0;
            while (this.components.has(`${id}-${n}`)) n += 1;
            id = `${id}-${n}`;
        }
        this.components.set(id, component);

        return id;
    }
    public static getComponent<T extends (abstract new (...args: any) => InstanceType<T>)>(t: T, id: string): InstanceType<T> {
        let component = this.components.get(id);
        if (!component)
            throw `No component exists with the ID '${id}'.`;
        assert(component instanceof t);
        return component;
    }
    public static deleteComponent(id: string) {
        this.components.delete(id);
    }

}