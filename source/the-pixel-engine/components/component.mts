import { Game } from "./game.mjs";
import { Transform } from "../maths/transform.mjs";


export class Component {


    public readonly id: string;

    constructor(args: {
        id?: string,
        transform?: Transform,
        enabled?: boolean,
    } = {}) {
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
    public get enabled(): boolean {
        return this._enabled && !!this.parent?.enabled;
    }
    public set enabled(e: boolean) {
        let previous = this._enabled;
        this._enabled = e;
        if (e && !previous)
            this.whenEnabled?.();
        else if (!e && previous)
            this.whenDisabled?.();
    }

    public enable(): this {
        this.enabled = true;
        return this;
    }
    public disable(): this {
        this.enabled = false;
        return this;
    }
    
    
    private _transform: Transform;
    private _globalTransform?: Transform;
    public get transform(): Transform {
        if (this._globalTransform)
            return this._globalTransform;
        this._globalTransform = this.parent ? this.parent.transform.mul(this._transform) : this._transform;
        return this._globalTransform;
    }
    public set localTransform(t: Transform) {
        this._transform = t;
        this.invalidateCache("_globalTransform");
    }
    public set globalTransform(t: Transform) {
        this._transform = this.parent ? this.parent.transform.inverse().mul(t) : t;
        this.invalidateCache("_globalTransform");
    }


    private hasAttribute<E extends string>(event: E): this is {[key in E]: any} {
        // @ts-ignore
        return this[event] !== undefined;
    }
    private hasEvent<E extends string>(event: E): this is {[key in E]: (...args: unknown[]) => unknown} {
        // @ts-ignore
        return this[event] !== undefined && typeof this[event] === "function";
    }
    public handleEvent<E extends string>(event: E, ...args: unknown[]): void {
        if (!this.enabled)
            return;

        if (this.hasEvent(event))
            this[event](...args);

        for (let child of this.children)
            child.handleEvent(event);
    }
    private invalidateCache<A extends string>(attribute: A) {
        this.handleEvent("_invalidateCache", attribute)
    }
    private _invalidateCache<A extends string>(attribute: A) {
        if (this.hasAttribute(attribute))
            delete this[attribute];
    }

    public whenStarted?(): void;
    public whenStopped?(): void;

    public whenEnabled?(): void;
    public whenDisabled?(): void;

    public whenTicked?(t: number): void;
    public whenFixedTicked?(t: number): void;

}