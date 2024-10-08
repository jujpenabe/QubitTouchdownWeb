class PlayerController {
    constructor(playerNo, Ball, Deck){
        this.playerNo = playerNo;
        this.maxCardSize = 4;
        this.Ball = Ball;
        this.Deck = Deck;
        this.hand = this.Deck.NewHand();
    }

    MoveBall(cardIndex){
        this.Ball.Move(this.hand[cardIndex]);
        this.hand[cardIndex] = this.Deck.GetCard();
    }
}