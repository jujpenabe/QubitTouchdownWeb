console.log("hi");
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

class Card{
    constructor (type){
        this.cardType = type;
    }
}

class Deck {
    constructor(){
       this.cards = [];
       //TODO: construir deck
       this.AddCards("H",7);
       this.AddCards("S",7);
       this.AddCards("X",4);
       this.AddCards("Y",9);
       this.AddCards("Z",7);
       this.AddCards("I",3);
       this.AddCards("Mes",3);
       this.AddCards("Sqrt",12);
    }

    NewHand(){
        const hand = [];
        for(let i = 0; i < 4; i++){
            hand.push(this.cards.pop());
        }
        return hand;
    }

    GetCard(){
        let card = 0;
        if(this.cards.length != 0){
            card = this.cards.pop();
            console.log("si");
        }
        return card;
    }

    AddCards(type, num){
        for(let i = 0; i < num; i++){
            this.cards.push(new Card(type))
        }
    }
}

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

class Node{
    constructor(type){
        this.type = type;
        this.links = [];
        this.keys = new Map();
    }
    /*
    SetLinks(node1,link1,node2,link2,node3,link3){
        this.links.push(node1);
        this.links.push(node2);
        this.links.push(node3);

        this.keys.set(link1,0);
        this.keys.set(link1,1);
        this.keys.set(link1,2);
    }
    */
    SetLinks(node1,link1){
        this.links.push(node1);
        this.keys.set(link1,0);
    }

    GetNode(cardType){
        let nodeRef;
        let tmp = this.keys.get(cardType);
        if (tmp != undefined){
            nodeRef = this.links[tmp];
        }
        return nodeRef;
    }
}

let plusNode = new Node("plus");
let minusNode = new Node("minus");

plusNode.SetLinks(minusNode,"Sqrt");
minusNode.SetLinks(plusNode,"Sqrt");

let ball = new BallController(plusNode);
let currDeck = new Deck();

let player1 = new PlayerController(1,ball,currDeck);

//console.log(player1);
player1.MoveBall(1);
//console.log(ball);

