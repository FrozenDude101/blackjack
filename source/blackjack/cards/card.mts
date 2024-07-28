import { Component } from "../../the-pixel-engine/components/component.mjs";
import { Kwargs } from "../../the-pixel-engine/types/kwargs.mjs";

export class Card extends Component {

    public readonly suit: Card.Suit;
    public readonly value: Card.Value;

    constructor(args: Kwargs<typeof Component, {suit: Card.Suit, value: Card.Value}>) {
        super(args);

        this.suit = args.suit;
        this.value = args.value;
    }
    
}

export namespace Card {

    export class Suit {

        private constructor() {}

        public static DIAMOND = new Suit();
        public static CLUB    = new Suit();
        public static HEART   = new Suit();
        public static SPADE   = new Suit();

        public isRed() { return this === Suit.DIAMOND || this === Suit.HEART; }
        public isBlack() { return !this.isRed(); }

        public toString() {
            switch (this) {
                case Suit.DIAMOND: return "D";
                case Suit.CLUB:    return "C";
                case Suit.HEART:   return "H";
                case Suit.SPADE:   return "S";
            }
        }

    }

    export class Value {

        private constructor() {}

        public static ACE   = new Value();
        public static TWO   = new Value();
        public static THREE = new Value();
        public static FOUR  = new Value();
        public static FIVE  = new Value();
        public static SIX   = new Value();
        public static SEVEN = new Value();
        public static EIGHT = new Value();
        public static NINE  = new Value();
        public static TEN   = new Value();
        public static JACK  = new Value();
        public static QUEEN = new Value();
        public static KING  = new Value();

        public toString() {
            switch (this) {
                case Value.ACE:   return "A";
                case Value.TWO:   return "2";
                case Value.THREE: return "3";
                case Value.FOUR:  return "4";
                case Value.FIVE:  return "5";
                case Value.SIX:   return "6";
                case Value.SEVEN: return "7";
                case Value.EIGHT: return "8";
                case Value.NINE:  return "9";
                case Value.TEN:   return "10";
                case Value.JACK:  return "J";
                case Value.QUEEN: return "Q";
                case Value.KING:  return "K";
            }
        }

        public get value() {
            switch (this) {
                case Value.ACE:   return [1, 11];
                case Value.TWO:   return [2];
                case Value.THREE: return [3];
                case Value.FOUR:  return [4];
                case Value.FIVE:  return [5];
                case Value.SIX:   return [6];
                case Value.SEVEN: return [7];
                case Value.EIGHT: return [8];
                case Value.NINE:  return [9];
                case Value.TEN:   
                case Value.JACK:
                case Value.QUEEN:
                case Value.KING:  return [10];
            }
        }

    }

}