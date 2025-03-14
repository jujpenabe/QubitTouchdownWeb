class PlayerController {
    constructor(playerNo, cards){
        this.playerNo = playerNo;
        this.maxCardSize = 4;
        this.hand = cards;
    }

    MoveBall(cardIndex){
        const tmp = this.hand[cardIndex];
        this.hand[cardIndex] = null;
        return tmp;
    }
}
module.exports = PlayerController;