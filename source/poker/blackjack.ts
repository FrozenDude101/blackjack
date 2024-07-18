class BlackJack extends Component {

    private readonly deck: Deck;

    private readonly playerHand: Hand;
    private readonly dealerHand: Hand;

    private readonly dealerBust: TextSprite;
    private readonly bustText: TextSprite;
    private readonly loseText: TextSprite;
    private readonly drawText: TextSprite;
    private readonly winText: TextSprite;
    private readonly startButton: Button;
    private readonly hitButton: Button;
    private readonly standButton: Button;

    constructor(args: Kwargs<typeof Component>) {
        super(args);

        this.deck = this.addChild(Deck, {});
        this.deck.shuffle();

        this.dealerHand = this.addChild(Hand, {transform: Transform.translation(160, 40)});
        this.playerHand = this.addChild(Hand, {transform: Transform.translation(160, 140)});

        this.startButton = this.addChild(Button, {text: "New Round",
            transform: Transform.translation(80, 75),
            onClick: () => this.setupRound(),
        });
        this.hitButton   = this.addChild(Button, {text: "Hit", enabled: false,
            transform: Transform.translation(240, 75),
            onClick: () => this.hit(),
        });
        this.standButton = this.addChild(Button, {text: "Stand", enabled: false,
            transform: Transform.translation(240, 105),
            onClick: () => this.endPlayerTurn(),
        });

        this.bustText = this.addChild(TextSprite, {text: "Bust!", enabled: false,
            transform: Transform.translation(160, 90),
        });

        this.loseText = this.addChild(TextSprite, {text: "You Lose!", enabled: false,
            transform: Transform.translation(160, 90),
        });

        this.winText = this.addChild(TextSprite, {text: "You Win!", enabled: false,
            transform: Transform.translation(160, 90),
        });

        this.drawText = this.addChild(TextSprite, {text: "Draw!", enabled: false,
            transform: Transform.translation(160, 90),
        });

        this.dealerBust = this.addChild(TextSprite, {text: "Bust!", enabled: false,
            transform: Transform.translation(160, 90),
        });
    }

    public setupRound() {
        this.dealerHand.reset();
        this.playerHand.reset();

        this.dealerHand.addCard(this.deck.deal().show());
        this.playerHand.addCard(this.deck.deal().show());
        this.dealerHand.addCard(this.deck.deal().hide());
        this.playerHand.addCard(this.deck.deal().show());

        this.startButton.enabled = false;
        this.hitButton.enabled = true;
        this.standButton.enabled = true;
        this.bustText.enabled = false;

        this.drawText.enabled = false;
        this.winText.enabled = false;
        this.loseText.enabled = false;
    }

    public hit() {
        this.playerHand.addCard(this.deck.deal().show());

        if (this.playerHand.isBust)
            this.endPlayerTurn();
    }

    public endPlayerTurn() {
        this.hitButton.enabled = false;
        this.standButton.enabled = false;

        if (this.playerHand.isBust) {
            this.bustText.enabled = true;
        } else {
            this.dealerHand.showAll(true);
            while (this.dealerHand.bestValue < 17 && !this.dealerHand.isBust)
                this.dealerHand.addCard(this.deck.deal().show());

            if (
                this.dealerHand.hasBlackjack && this.playerHand.hasBlackjack ||
                this.dealerHand.bestValue === this.playerHand.bestValue
            ) {
                this.drawText.enabled = true;
            } else if (
                this.dealerHand.hasBlackjack && !this.playerHand.hasBlackjack ||
                this.dealerHand.bestValue > this.playerHand.bestValue
            ) {
                this.loseText.enabled = true;
            } else {
                this.winText.enabled = true;
            }
        }

        this.startButton.enabled = true;

    }

}