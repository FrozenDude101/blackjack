class Game extends SingletonComponent<Game>() {

    public static readonly CANVAS_CONTAINER_ID = "body";
    public static readonly CANVAS_SIZE         = new Vector2(320, 180);

    public static readonly MILLISECONDS_PER_TICK  = 1000/60;
    public static readonly MILLISECONDS_PER_FRAME = 1000/60;

    private container: HTMLElement;
    private canvas: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    private scale = 1;

    private animationRequest?: number;
    private previousTimestamp?: number;
    private tickMilliseconds = 0;
    private frameMilliseconds = 0;

    public get transform(): Transform {
        return this._transform;
    }

    public get enabled() {
        return !!this.animationRequest;
    }
    public set enabled(e: boolean) {
        this._enabled = e;
    }

    constructor(id: string) {
        super({parent: null as unknown as Component, id: id});

        let container = document.getElementById(Game.CANVAS_CONTAINER_ID);
        if (!container) throw `Couldn't find an element with the ID '${Game.CANVAS_CONTAINER_ID}'.`;
        this.container = container;

        this.canvas = document.createElement("canvas");
        this.container.appendChild(this.canvas);
        this.rescale();
    }

    public start() {
        if (this.animationRequest)
            throw `Game cannot be started, as it is already running.`;

        this.handleEvent("onStart");

        window.addEventListener("mousedown", this._onMouseDown.bind(this));
        window.addEventListener("mouseup",   this._onMouseUp.bind(this));
        window.addEventListener("mousemove", this._onMouseMove.bind(this));

        this.animationRequest = window.requestAnimationFrame(this.loop.bind(this));
    }
    public stop() {
        if (!this.animationRequest)
            throw `Game cannot be stopped, as it is not running.`;

        window.cancelAnimationFrame(this.animationRequest);
        delete this.animationRequest;
        this.handleEvent("onStop");
    }

    public rescale() {
        let scale = Math.min(this.container.offsetWidth / Game.CANVAS_SIZE.x,
                             this.container.offsetHeight / Game.CANVAS_SIZE.y);
        
        this.scale = scale;
        this.canvas.width = Game.CANVAS_SIZE.x * this.scale;
        this.canvas.height = Game.CANVAS_SIZE.y * this.scale;
        let ctx = this.canvas.getContext("2d");
        if (!ctx) throw `Failed to get Canvas Rendering Context.`;
        this.ctx = ctx;
        this.ctx.scale(this.scale, this.scale);
        this.ctx.imageSmoothingEnabled = false;
    }

    private normaliseMousePosition(event: MouseEvent): Vector2 {
        return new Vector2(event.x, event.y)
            .sub(new Vector2(this.canvas.offsetLeft, this.canvas.offsetTop))
            .div(this.scale);
    }
    public _onMouseDown(event: MouseEvent) {
        let mousePos = this.normaliseMousePosition(event);
        this.handleEvent("onMouseDown", mousePos);
        this.handleEvent("onMouseMove", mousePos);
    }
    public _onMouseUp(event: MouseEvent) {
        let mousePos = this.normaliseMousePosition(event);
        this.handleEvent("onMouseMove", mousePos);
        this.handleEvent("onMouseUp", mousePos);
    }
    public _onMouseMove(event: MouseEvent) {
        let mousePos = this.normaliseMousePosition(event);
        this.handleEvent("onMouseMove", mousePos);
    }

    private loop(timestamp: number) {
        try {
            this.animationRequest = window.requestAnimationFrame(this.loop.bind(this));
            if (!this.previousTimestamp) {
                this.previousTimestamp = timestamp;
                return;
            }

            let millisecondsElapsed = timestamp - this.previousTimestamp;
            this.previousTimestamp = timestamp;
            this.tickMilliseconds += millisecondsElapsed;
            this.frameMilliseconds += millisecondsElapsed;

            let ticks = this.tickMilliseconds / Game.MILLISECONDS_PER_TICK;
            for (let i = 0; i < ticks; i++) {
                this.updateTick(Game.MILLISECONDS_PER_TICK);
            }
            this.tickMilliseconds = this.tickMilliseconds % Game.MILLISECONDS_PER_TICK;

            if (ticks < 2 && this.frameMilliseconds > Game.MILLISECONDS_PER_FRAME) {
                this.renderFrame();
                this.frameMilliseconds %= Game.MILLISECONDS_PER_FRAME;
            }
            
        } catch (e) {
            this.stop();
            throw e;
        }
    }

    private updateTick(milliseconds: number) {
        this.handleEvent("update", milliseconds / 1000);
    }
    private renderFrame() {
        let sprites = Array.from(Game.sprites.values()).sort(
            (a, b) => a.zIndex - b.zIndex,
        );
        
        this.ctx.clearRect(0, 0, Game.CANVAS_SIZE.x, Game.CANVAS_SIZE.y);
        for (let sprite of sprites) {
            if (!sprite.enabled)
                continue;
            this.ctx.save();
            this.ctx.transform(...sprite.transform.abcdef);
            sprite.draw(this.ctx);
            this.ctx.restore();
        }
    }

    private static components: Map<string, Component> = new Map();
    private static sprites: Map<string, Sprite> = new Map();
    private static mouseColliders: Map<string, MouseTrigger> = new Map();
    public static registerComponent(component: Component, id?: string): string {
        if (!id) id = component.constructor.name;

        if (this.components.has(id)) {
            let n = 0;
            while (this.components.has(`${id}-${n}`)) n += 1;
            id = `${id}-${n}`;
        }
        this.components.set(id, component);

        if (component instanceof Sprite)
            this.sprites.set(id, component);

        if (component instanceof MouseTrigger)
            this.mouseColliders.set(id, component);

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
        this.sprites.delete(id);
        this.mouseColliders.delete(id);
    }

}