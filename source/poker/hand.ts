class Hand extends Component {

    private hand: Card[] = [];

    public addCard(card: Card) {
        card.newParent(this);
        card.enabled = true;
        this.hand.push(card);

        for (let i = 0; i < this.hand.length; i++) {
            this.hand[i].transform = Transform.translation(-this.hand.length*11 + i*22 + 11, 0);
        }
    }

    public reset() {
        for (let card of this.hand) {
            card.delete();
        }
        this.removeAllChildren();
        this.hand = [];
    }

    public get values(): number[] {
        let cardValues = this.hand.map(c => c.handValue);
        let values = [0];
        for (let cardValue of cardValues) {
            values = values.flatMap(v => cardValue.map(cv => v + cv));
        }
        return values.reduce((a, v) => a.includes(v) ? a : a.concat([v]), [] as number[]);
    }
    public get bestValue(): number {
        return Math.max(...this.values.filter(v => v <= 21))
    }

    public get isBust(): boolean {
        return this.bestValue === -Infinity;
    }

    public get hasBlackjack(): boolean {
        return this.hand.length === 2 && this.bestValue === 21;
    }

    public showAll(withAnimation: boolean): void {
        for (let card of this.hand)
            withAnimation && card.isFaceDown ? card.flip() : card.show();
    }
}