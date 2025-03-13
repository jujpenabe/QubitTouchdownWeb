const PlayerController = require('../Game/PlayerController');
const BallController = require('../Game/BallController');
const Node = require('../Game/Node');
const Card = require('../Game/Deck');
const net = require('net');

class QbitClient {
    constructor(){
        this.client = new net.Socket();
    }
    connect(){
        this.client.connect(3000, '192.168.X.X', () => {
            console.log('Conectado al servidor');
        });

        this.client.on('data', (data) => {
            console.log('Mensaje del servidor:', data.toString());
        });

        this.client.on('close', () => {
            console.log('Conexión cerrada');
        });
    }
}

const client = new QbitClient();
client.connect();