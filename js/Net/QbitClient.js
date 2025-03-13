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
        this.client.connect(3000, '192.168.xx.xx', () => {
            console.log('Conectado al servidor');
        });

        this.client.on('data', (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.hand) {
                    console.log(`Mano recibida:`, message.hand);
                } else {
                    console.log('Mensaje del servidor:', data.toString());
                }
            } catch (e) {
                console.log('Mensaje del servidor:', data.toString());
            }
        });

        this.client.on('close', () => {
            console.log('Conexión cerrada');
        });
    }
}

const client = new QbitClient();
client.connect();