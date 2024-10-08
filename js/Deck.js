
/*
7 H Cards
7 S Cards
4 X Cards
9 Y Cards
7 Z Cards
3 I Cards
3 Mes Cards
12 sqrt Cards 
*/

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
       for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = this.cards[i];
        this.cards[i] = this.cards[j];
        this.cards[j] = tmp;
      }
    
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
        }
        return card;
    }

    AddCards(type, num){
        for(let i = 0; i < num; i++){
            this.cards.push(new Card(type))
        }
    }
}

//let testDeck = new Deck();
//console.log(testDeck);