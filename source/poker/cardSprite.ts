class CardSprite extends Component {

    public parent!: Card;

    constructor(args: Kwargs<typeof Component>) {
        super(args);
        let suit = this.parent.suit;
        let value = this.parent.value;
        this.addChild(ImageSprite, {path: `${Card.RES_PATH}/base.png`});
        this.addChild(ImageSprite, {path: `${Card.RES_PATH}/${suit}.png`});
        this.addChild(ImageSprite, {path: `${Card.RES_PATH}/${
            suit === Card.SUIT.DIAMONDS || suit === Card.SUIT.HEARTS ? "R" : "B"
        }${value}.png`});
    }

}