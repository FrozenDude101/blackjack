abstract class Resource {

    public abstract readonly name: string;

    private _status = Resource.STATUS.LOADING;
    public get status() { return this._status; }
    protected set status(s) { this._status = s; }

    protected ready() {
        this.status = Resource.STATUS.READY;
    }
    protected failed() {
        this.status = Resource.STATUS.FAILED;
    }
}


namespace Resource {
    export enum STATUS {
        READY,
        LOADING,
        FAILED,
    }
}

class ImageResource extends Resource {

    public readonly name: string;

    private readonly image: HTMLImageElement;

    constructor(path: string) {
        super();
        
        this.name = path;
        this.image = new Image();
        this.image.onload = this.ready.bind(this);
        this.image.onerror = this.failed.bind(this);
        this.image.src = path;
    }

    public get() {
        return this.image;
    }

}

class SoundResource extends Resource {

    public readonly name: string;

    private readonly sound: HTMLAudioElement;

    constructor(path: string) {
        super();

        this.name = path;
        this.sound = new Audio(path);
        this.sound.addEventListener("canplaythrough", this.ready.bind(this));
        this.sound.onerror = this.failed.bind(this);
        this.sound.src = path;
    }

    public get() {
        return this.sound;
    }

}