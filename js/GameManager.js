class GameManager {
    constructor() {

        if (!!GameManager.SharedInstance) {
            return GameManager.SharedInstance;
        }
        GameManager.SharedInstance = this;

        this.Estados = {
            BEGIN: 'begin',
            IN_GAME: 'inGame',
            TOUCHDOWN: 'Touchdown',
            END_GAME: 'EndGame'
        };
        
        this.minusNode = new Node("minus");
        this.plusNode = new Node("plus");
        this.iNode = new Node("i");
        this.iMinusNode = new Node("iMinus");
        this.ceroNode = new Node("cero");
        this.oneNode = new Node("one");

        this.ceroNode.SetLinks(this.plusNode,"H",this.iMinusNode,"Sqrt",this.oneNode,["X","Y"]);
        this.oneNode.SetLinks(this.minusNode,"H",this.iNode,"Sqrt",this.ceroNode,["X","Y"]);
        this.iNode.SetLinks(this.minusNode,"S",this.ceroNode,"Sqrt",this.iMinusNode,["X","Z","H"]);
        this.iMinusNode.SetLinks(this.plusNode,"S",this.oneNode,"Sqrt",this.iNode,["X","Z","H"]);

        this.ball = new BallController (this.ceroNode);
        this.deck = new Deck ();

        this.player1 = new PlayerController(1,this.ball,this.deck);
        this.player2 = new PlayerController(2,this.ball,this.deck);

        this.estadoActual = this.Estados.BEGIN;

        this.currentPlayer = this.player1;

        this.fin = false;



    }

    ChangeToBegin() {
        this.estadoActual = this.Estados.BEGIN;
    }

    ChangeToInGame() {
        this.estadoActual = this.Estados.IN_GAME;
    }

    ChangeToTouchDown() {
        this.estadoActual = this.Estados.TOUCHDOWN;
    }

    ChangeToEndGame() {
        this.estadoActual = this.Estados.END_GAME;
    }


    StatesLogic() {
        if (this.estadoActual == this.Estados.BEGIN) {
            //TO DO:
            //esperar input de jugador para dado binario y ubicar balon
            
            let dice = Math.floor(Math.random() * 2);
            console.log(dice);
            if( dice == 0){
                this.ball.position = this.ceroNode;
            }else{
                this.ball.position = this.oneNode;
            }
            this.estadoActual = this.Estados.IN_GAME
        }
        else if (this.estadoActual == this.Estados.IN_GAME) {
        
            this.currentPlayer.MoveBall(1);
            if (this.ball.position == this.plusNode){
                this.player1Score += 1; 
                this.currentPlayer = this.player2;
                this.estadoActual = this.Estados.BEGIN;
            }
            
            else if (this.ball.position == this.minusNode){
                this.player2.playerScore += 1; 
                this.currentPlayer = this.player1;
                this.estadoActual = this.Estados.BEGIN;
            }
            
           if (this.deck.cards.length == 0){
                this.estadoActual = this.Estados.END_GAME;                 //si se acaban las cartas, pasar a endgame

           }
        }
        else if (this.estadoActual == this.Estados.TOUCHDOWN) {
            //TO DO:
            // ESTO NO SE NECESITA?
        }   
        else if (this.estadoActual == this.Estados.END_GAME) {
            console.log("chi");
            //TO DO:
            //Contar touchdowns y definir ganador
            console.log(this.player1.playerScore);
            console.log(this.player2.playerScore);

            if(this.player1.playerScore >= this.player2.playerScore){
                console.log("player1 wins");
            }else{
                console.log("player 2 wins");
            }
            this.fin = true;
        }

    }

}