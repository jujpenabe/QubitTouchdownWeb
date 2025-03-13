class PlayerController {
    constructor(playerNo, cards){
        this.playerNo = playerNo;
        this.maxCardSize = 4;
        this.hand = cards;
    }

    MoveBall(cardIndex){
        return this.hand[cardIndex].pop();
    }
}
module.exports = PlayerController;