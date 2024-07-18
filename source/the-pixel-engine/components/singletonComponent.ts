function SingletonComponent<T>() {
    return (class SingletonComponent extends Component {
        public static readonly Instance: T;
        constructor(args: Kwargs<typeof Component>) {
            super(args);
            //@ts-ignore
            this.constructor.Instance = this;
        }
    });
}