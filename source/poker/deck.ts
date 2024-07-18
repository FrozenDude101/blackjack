class Deck extends Component {

    private deck: Card[] = [];

    constructor(args: Kwargs<typeof Component>) {
        super(args);

        this.refreshDeck();
    }

    public refreshDeck(): this {
        for (let card of this.deck) {
            card.delete();
        }
        this.removeAllChildren();
        this.deck = [];

        for (let suit of Card.SUIT.values()) {
            let j = 1;
            for (let value of Card.VALUE.values()) {
                this.deck.push(this.addChild(Card, {
                    suit: suit, value: value,
                    enabled: false,
                }));
            }
        }

        return this;
    }

    public shuffle(): this {
        for (let i = 0; i < this.deck.length; i++) {
            let cardIndex = Math.floor(Math.random()*i);
            let temp = this.deck[i];
            this.deck[i] = this.deck[cardIndex];
            this.deck[cardIndex] = temp;
        }

        return this;
    }

    public deal(): Card {
        let next = this.deck.pop();
        if (!next)
            return this.refreshDeck().shuffle().deal();
        return next;
    }

}