import { Game } from "./game.mjs";
import { Transform } from "../maths/transform.mjs";


export class Component {


    public readonly id: string;

    private _transform: Transform;
    public get transform(): Transform { return this.parent ? this.parent.transform.mul(this._transform) : this._transform; }
    public set localTransform(t: Transform) { this._transform = t; }
    public set globalTransform(t: Transform) { this._transform = this.parent ? this.parent.transform.inverse().mul(t) : t; }


    constructor(args: {
        id?: string,
        transform?: Transform,
        enabled?: boolean,
    }) {
        if (args.id === undefined)        args.id = Game.registerComponent(this, args.id);
        if (args.transform === undefined) args.transform = Transform.IDENTITY;
        if (args.enabled === undefined)   args.enabled = true;

        this.id         = args.id;
        this._transform = args.transform;
        this._enabled    = args.enabled;
    }
    public delete(): void {
        this.parent?.removeComponent(this.id);
        Game.deleteComponent(this.id);
    }


    private _parent?: Component;
    public get parent(): Component | undefined { return this._parent; }
    private set parent(newParent: Component | undefined) {
        this.parent?.removeComponent(this.id);
        this._parent = newParent;
    }

    private _children: Map<string, Component> = new Map();
    public get children(): Readonly<Component[]> { return Array.from(this._children.values()); }

    public addComponent<T extends Component>(child: T): T {
        if (child.parent)
            child.parent.removeComponent(child.id);
        child._parent = this;
        return child;
    }
    public removeComponent(childId: string) {
        for (let child of this.children) {
            child.parent = undefined;
        }
        this._children.delete(childId);
    }
    public removeAllComponents() {
        for (let child of this.children) {
            this.removeComponent(child.id);
        }
    }

    
    private _enabled: boolean;
    public set enabled(e: boolean) { this._enabled = e; }
    public get enabled(): boolean { return this._enabled && !!this.parent?.enabled; }

    public enable() {

    }
    public disable() {
        
    }

    public WhenEnabled?(): void;
    public WhenDisabled?(): void;

}