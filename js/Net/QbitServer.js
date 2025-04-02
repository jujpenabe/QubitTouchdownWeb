const Node = require('../Game/Node');
const Deck = require('../Game/Deck');
const BallController = require('../Game/BallController');
const net = require('net');

class ServerGameManager{
    constructor(){
        if (!!ServerGameManager.SharedInstance) {
            return ServerGameManager.SharedInstance;
        }
        ServerGameManager.SharedInstance = this;

        this.clients = [];
        this.deck = new Deck ();
        this.turn = 0;
        this.server = net.createServer((socket) => this.handleConnection(socket));
        this.playedCards = 52;
        this.waiting=false;
        this.player1Score = 0;
        this.player2Score = 0;
        
       
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
        this.randomizeBall();
        
        
    }

    handleConnection(socket) {
        //el servidor acepta solo dos conexiones
        if (this.clients.length >= 2) {
            socket.end('Servidor lleno');
            return;
        }

        this.clients.push(socket);
        console.log(`Jugador ${this.clients.length} conectado (${this.clients.length}/2)`);
        
        if (this.clients.length === 2) {
            console.log('Dos jugadores conectados. Repartiendo manos...');
            this.dealHands();
            this.currentPlayer = this.clients[0];
            this.waitingPlayer = this.clients[1];
            //esto inicia el ciclo de juego:
            this.currentPlayer.write(JSON.stringify({ turn: 'Tu turno. Envía una carta.' }) + "\n");
            //El servidor se cierra en un tiempo arbitrario
            setTimeout(() => {
                this.stopServer();
            }, 100000);
            
            
        }

        socket.on('data', (data) => {
            //cada vez que se recibe un mensaje, avanzar el juego
            console.log('Recibido:', data.toString());
                this.waitForMove(data);
        });
    }

    dealHands() {
        this.clients.forEach((client, index) => {
            const hand = this.deck.NewHand();
            client.write(JSON.stringify({ player: index + 1, hand }) + "\n");
            console.log(JSON.stringify({ player: index + 1, hand }) + "\n");
        });
        
        console.log('Manos repartidas. Esperando jugadas...');
    }

    waitForMove(data) {
        //esto es basicamente la logica del juego
            try {
                console.log("Recibido:", data.toString());
                const { card } = JSON.parse(data.toString());
                if (card) {
                    const cardToSend = this.deck.GetCard();
                    this.currentPlayer.write(JSON.stringify({ newCard: cardToSend}) + "\n");
                    this.ball.Move(card);
                    console.log(`Jugador jugó la carta:`, card);
                    this.broadcast(`Jugador jugó una carta.`);
                    this.playedCards--;
                    console.log('Cartas restantes:', this.playedCards);
                    console.log('Posicion actual:', this.ball.position.type);
                    this.clients.forEach(client => client.write(JSON.stringify({ position: this.ball.position.type }) + "\n"));
                    if (this.ball.position.type == "plus"){
                        this.player1Score++;
                        this.broadcast('jugador 1 anotó un punto');
                        this.randomizeBall();
                        this.changeTurnScored(this.clients[1],this.clients[0]);
                        console.log('Puntaje jugador 1:', this.player1Score, 'Puntaje jugador 2:', this.player2Score);

                    }else if (this.ball.position.type == "minus"){
                        this.player2Score++;
                        this.broadcast('jugador 2 anotó un punto');
                        this.randomizeBall();
                        this.changeTurnScored(this.clients[0],this.clients[1]);
                        console.log('Puntaje jugador 1:', this.player1Score, 'Puntaje jugador 2:', this.player2Score);
                    }
                    else{
                        this.changeTurn();
                    }
                    
                }else{
                    console.log('Carta no válida');
                    this.changeTurn();
                }
            } catch (e) {
                console.log('Error al procesar movimiento:', e);
            }
        this.waiting = false;
    }

    //Se supone que esta función requiere el input de un jugador, pero de momento se ejecuta automáticamente
    randomizeBall(){
        let dice = Math.floor(Math.random() * 2);
            if( dice == 0){
                this.ball.position = this.ceroNode;
            }else{
                this.ball.position = this.oneNode;
            }
    }

    changeTurn(){
        let temp = this.currentPlayer;
        this.currentPlayer = this.waitingPlayer;
        this.waitingPlayer = temp;
        if(this.playedCards > 0){
            this.currentPlayer.write(JSON.stringify({ turn: 'Tu turno. Envía una carta.' }) + "\n");
            this.turn++;
        }else{
            setTimeout(() => {
                this.stopServer();
            }, 1000);
        }
        
        
    }

    changeTurnScored(scoredPlayer,otherPlayer){
        this.currentPlayer = otherPlayer;
        this.waitingPlayer = scoredPlayer;
        if(this.playedCards > 0){
            this.currentPlayer.write(JSON.stringify({ turn: 'Tu turno. Envía una carta.' }) + "\n");
            this.turn++;
        }else{
            setTimeout(() => {
                this.stopServer();
            }, 1000);
        }
    }


    broadcast(message) {
        this.clients.forEach(client => client.write(JSON.stringify({ message: message }) + "\n"));
    }

    start(){
        this.server.listen(3000, '0.0.0.0', () => {
            console.log('Servidor esperando jugadores en el puerto 3000...');
        });
        
    }

    stopServer() {
        this.broadcast(`juego terminado. Puntaje Jugador 1: ${this.player1Score} Puntaje Jugador 2: ${this.player2Score}`);
        console.log("Cerrando servidor...");
        console.log('Puntaje jugador 1:', this.player1Score, 'Puntaje jugador 2:', this.player2Score);
        console.log('Posicion actual:', this.ball.position.type);
        console.log('Cartas restantes:', this.deck.cards);

        // Cerrar todas las conexiones activas
        this.clients.forEach(client => client.destroy());

        // Cerrar el servidor
        this.server.close(() => {
            console.log("Servidor cerrado.");
            process.exit(0);  // Finaliza el proceso de Node.js
        });

        // Manejar errores en caso de que el servidor ya esté cerrado o tenga problemas
        this.server.on("error", (err) => {
            console.error("Error al cerrar el servidor:", err);
        });
    }
}

//Ejemplo de uso:
//const server = new ServerGameManager();
//server.start();
