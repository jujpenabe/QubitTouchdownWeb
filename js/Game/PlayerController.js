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

    GiveCard(card){
        for(let i = 0; i < this.maxCardSize; i++){
            if(this.hand[i] == null){
                this.hand[i] = card;
            }
        }
    }
}
module.exports = PlayerController;