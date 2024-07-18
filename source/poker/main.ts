const game = new Game("poker");

const blackjack = game.addChild(BlackJack, {});

game.handleEvent("setup");
game.start();