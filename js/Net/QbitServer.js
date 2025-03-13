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
        this.server = net.createServer((socket) => this.handleConnection(socket));
        
        this.Estados = {
            BEGIN: 'begin',
            IN_GAME: 'inGame',
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
    }

    handleConnection(socket) {
        if (this.clients.length >= 2) {
            socket.end('Servidor lleno');
            return;
        }

        this.clients.push(socket);
        console.log(`Jugador conectado (${this.clients.length}/2)`);
        
        if (this.clients.length === 2) {
            console.log('Dos jugadores conectados. Repartiendo manos...');
            this.dealHands();
        }
    }

    dealHands() {
        this.clients.forEach((client, index) => {
            const hand = this.deck.NewHand();
            client.write(JSON.stringify({ player: index + 1, hand }));
        });
        
        console.log('Manos repartidas. Cerrando servidor en 3 segundos...');
        setTimeout(() => {
            this.clients.forEach(client => client.end('Servidor cerrando...'));
            this.server.close(() => {
                console.log('Servidor cerrado');
            });
        }, 3000);
    }

    start(){
        this.server.listen(3000, '0.0.0.0', () => {
            console.log('Servidor esperando jugadores en el puerto 3000...');
        });
        
    }
}

const server = new ServerGameManager();
server.start();
