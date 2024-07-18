class Timer extends Component {

    private readonly length: number;
    private readonly onStart?:  () => void;
    private readonly onT?:      (t: number) => void;
    private readonly onFinish?: () => void;

    private t = 0;

    constructor(args: Kwargs<typeof Component, {
        length?: number,
        onStart?:  () => void,
        onT?:      (t: number) => void,
        onFinish?: () => void,
    }>) {
        super(args);
        if (args.length === undefined) args.length = 1;

        this.length   = args.length;
        this.onStart  = args.onStart;
        this.onT      = args.onT;
        this.onFinish = args.onFinish;

        this.enabled = false;
    }

    public start() {
        this.enabled = true;
        this.t = 0;
        this.onStart?.();
        this.onT?.(0);
    }

    public update(t: number): void {
        this.t += t / this.length;
        if (this.t >= 1) {
            this.stop();
            return;
        }
        this.onT?.(this.t);
    }

    public stop() {
        this.enabled = false;
        this.t = 1;
        this.onT?.(1);
        this.onFinish?.();
    }

}