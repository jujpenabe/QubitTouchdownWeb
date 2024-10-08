class BallController{
    constructor(position){
        this.position = position;
    }
    Move(card){
        let tmp = this.position.GetNode(card.cardType);
        if(tmp != undefined){
            this.position = tmp;
        }
    }
}