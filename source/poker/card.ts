class Card extends Component {

    public static readonly RES_PATH = "cards";

    public readonly suit: Card.SUIT;
    public readonly value: Card.VALUE;

    private readonly front: CardSprite;
    private readonly back: ImageSprite;
    private readonly flipTimer: Timer;
    private spritesFlipped = false;
    private incoming: Component;
    private outgoing: Component;
    private flipSound: Sound;

    // Sound Effect from <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=91468">Pixabay</a>

    constructor(args: Kwargs<typeof Component, {suit: Card.SUIT, value: Card.VALUE}>) {
        super(args);

        this.suit = args.suit;
        this.value = args.value;
        this.front = this.addChild(CardSprite, {});
        this.back = this.addChild(ImageSprite, {path: `${Card.RES_PATH}/back.png`});
        this.front.enabled = false;

        this.flipTimer = this.addChild(Timer, {onT: (t) => this.flipT(t) });
        this.incoming = this.front;
        this.outgoing = this.back;
        this.flipSound = this.addChild(Sound, {
            path: `${Card.RES_PATH}/cardflip.mp3`,
        })
    }

    public show(): this {
        this.front.enabled = true;
        this.back.enabled = false;
        return this;
    }
    public hide(): this {
        this.front.enabled = false;
        this.back.enabled = true;
        return this;
    }

    public flip() {
        this.flipTimer.start();
        this.spritesFlipped = false;
        this.incoming = this.front.enabled ? this.back : this.front;
        this.outgoing = this.back.enabled ? this.back : this.front;
        this.flipSound.play();
    }

    public flipSprites() {
        this.front.enabled = !this.front.enabled;
        this.back.enabled = !this.back.enabled;
        this.spritesFlipped = true;
    }
    public flipT(t: number) {
        if (t <= 0.5)
            this.outgoing.transform = Transform.scale(Math.cos(Math.PI * t), 1);
        if (t >= 0.5)
            this.incoming.transform = Transform.scale(Math.sin(Math.PI * (t - 0.5)), 1);
        if (!this.spritesFlipped && t >= 0.5)
            this.flipSprites();
    }

    public get handValue() {
        switch (this.value) {
            case Card.VALUE.ACE:   return [1, 11];
            case Card.VALUE.TWO:   return [2];
            case Card.VALUE.THREE: return [3];
            case Card.VALUE.FOUR:  return [4];
            case Card.VALUE.FIVE:  return [5];
            case Card.VALUE.SIX:   return [6];
            case Card.VALUE.SEVEN: return [7];
            case Card.VALUE.EIGHT: return [8];
            case Card.VALUE.NINE:  return [9];
            case Card.VALUE.TEN:   
            case Card.VALUE.JACK:
            case Card.VALUE.QUEEN:
            case Card.VALUE.KING:  return [10];
        }
    }

    public get isFaceDown() {
        return !this.front.enabled && this.back.enabled;
    }

}

namespace Card {
    export enum SUIT {
        CLUBS    = "C",
        DIAMONDS = "D",
        HEARTS   = "H",
        SPADES   = "S",
    }

    export enum VALUE {
        ACE   = "A",
        TWO   = "2",
        THREE = "3",
        FOUR  = "4",
        FIVE  = "5",
        SIX   = "6",
        SEVEN = "7",
        EIGHT = "8",
        NINE  = "9",
        TEN   = "10",
        JACK  = "J",
        QUEEN = "Q",
        KING  = "K",
    }
}

namespace Card.SUIT {
    export function values(): SUIT[] {
        return [
            SUIT.CLUBS,
            SUIT.DIAMONDS,
            SUIT.HEARTS,
            SUIT.SPADES,
        ];
    }
}

namespace Card.VALUE {
    export function values(): VALUE[] {
        return [
            VALUE.ACE,
            VALUE.TWO,
            VALUE.THREE,
            VALUE.FOUR,
            VALUE.FIVE,
            VALUE.SIX,
            VALUE.SEVEN,
            VALUE.EIGHT,
            VALUE.NINE,
            VALUE.TEN,
            VALUE.JACK,
            VALUE.QUEEN,
            VALUE.KING,
        ];
    }
}