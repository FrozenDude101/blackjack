class Sound extends Component {

    private readonly sound: SoundResource;

    constructor(args: Kwargs<typeof Component, {path: string, groupName?: string}>) {
        super(args);

        this.sound = ResourceLoader.loadSound(args.path, args.groupName);
    }

    public play() {
        // @ts-ignore
        this.sound.get().cloneNode().play();
    }

}