import { ResourceLoader } from "./resourceLoader.mjs";

export abstract class Resource {

    public readonly id: string;

    private _status = Resource.STATUS.IDLE;
    public  get status()   { return this._status; }
    private set status(s)  { this._status = s; }
    public get isIdle()    { return this.status === Resource.STATUS.IDLE;    }
    public get isLoading() { return this.status === Resource.STATUS.LOADING; }
    public get isReady()   { return this.status === Resource.STATUS.READY;   }
    public get isFailed()  { return this.status === Resource.STATUS.FAILED;  }

    constructor(id: string) {
        this.id = id;
        ResourceLoader.registerResource(this, id);
    }
    
    public load(): this {
        if (!this.isIdle) throw `Resource ${this.id} cannot be loaded when it is ${this.status}`;
        this.status = Resource.STATUS.LOADING;
        return this;
    }

    protected whenReady(): void {
        if (!this.isLoading) throw `Resource ${this.id} cannot be ready when it is ${this.status}`;
        this.status = Resource.STATUS.READY;
    }
    protected whenFailed(): void {
        if (!this.isLoading) throw `Resource ${this.id} cannot be failed when it is ${this.status}`;
        this.status = Resource.STATUS.FAILED;
    }

}
export namespace Resource {
    export enum STATUS { IDLE, LOADING, READY, FAILED };
}

export class ImageResource extends Resource {

    private readonly path: string;
    private readonly _image = new Image();
    public get image() {
        if (!this.isReady) throw `Cannot access an image that is ${this.status}.`;
        return this._image;
    }

    constructor(path: string) {
        super(path);
        this.path = path;
    }

    public load(): this {
        super.load();
        this._image.onload  = () => this.whenReady();
        this._image.onerror = () => this.whenFailed();
        this._image.src = `${ResourceLoader.BASE_PATH}${this.path}`;
        return this;
    }

}