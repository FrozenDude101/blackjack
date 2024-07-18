abstract class Component {

    public readonly id: string;
    public parent: Component;
    private _children: Map<string, Component> = new Map();
    public get children() { return Array.from(this._children.values()); }

    public _enabled: boolean = true;
    public set enabled(e: boolean) { this._enabled = e; }
    public get enabled() { return this._enabled && this.parent.enabled; }

    public _transform: Transform;
    public get transform(): Transform { return this.parent.transform.mul(this._transform); }
    public set transform(t) { this._transform = t; }

    constructor(args: {parent: Component, id?: string, transform?: Transform, enabled?: boolean}) {
        if (args.transform === undefined) args.transform = Transform.IDENTITY;
        if (args.enabled === undefined)   args.enabled   = true;

        this.parent = args.parent;
        this.id = Game.registerComponent(this, args.id);
        this._transform = args.transform;
        this.enabled = args.enabled;
    }
    public setup?(): void;

    public addChild<T extends new (args: Kwargs<T>) => Component & InstanceType<T>>(
        component: T, args: Omit<Kwargs<T>, "parent">,
    ): InstanceType<T> {
        //@ts-ignore
        let c = new component({...args, parent: this});
        this._children.set(c.id, c);
        return c;
    }
    public removeChild(id: string): void {
        this._children.delete(id);
    }
    public removeAllChildren(): void {
        for (let id of this._children.keys()) {
            this.removeChild(id);
        }
        this._children.clear();
    }

    public delete(): void {
        for (let component of this.children) {
            component.delete();
        }
        Game.deleteComponent(this.id);
    }

    public addComponent<T extends Component>(component: T): T {
        this._children.set(component.id, component);
        return component;
    }
    public newParent(parent: Component) {
        this.parent.removeChild(this.id);
        this.parent = parent;
        parent.addComponent(this);
    }

    public hasAttribute<A extends string>(key: A): this is {[key in A]: any} {
        // @ts-ignore
        return this[key] !== undefined;
    }

    public handleEvent<E extends string>(event: E, ...args: unknown[]): void {
        if (!this.enabled)
            return;

        if (this.hasAttribute(event))
            this[event](...args);
        
        for (let child of this.children) {
            child.handleEvent(event, ...args);
        }
    }

    public onMouseDown?(mousePos: Vector2): void;
    public onMouseUp?(mousePos: Vector2): void;
    public onMouseMove?(mousePos: Vector2): void;

    public update?(t: number): void;

}