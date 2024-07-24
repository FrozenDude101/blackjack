import { Game } from "../the-pixel-engine/components/game.mjs";
import { BlackjackBackground } from "./background.mjs";

let game = new Game();

game.addComponent(new BlackjackBackground());

game.start();