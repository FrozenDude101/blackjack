import { Component } from "../../the-pixel-engine/components/component.mjs";
import { ImageSprite } from "../../the-pixel-engine/components/sprite.mjs";
import { Card } from "./card.mjs";

export class CardSprite extends Component {

    constructor(suit: Card.Suit, value: Card.Value) {
        super();

        this.addComponent(new ImageSprite({path: "cards/base.png", zIndex: 0}));
        this.addComponent(new ImageSprite({path: `cards/${suit}.png`, zIndex: 1}));
        this.addComponent(new ImageSprite({path: `cards/${suit.isRed ? "R" : "B"}${value}.png`, zIndex: 1}));
    }

}