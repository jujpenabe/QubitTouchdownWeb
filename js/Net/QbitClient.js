const PlayerController = require('../Game/PlayerController');
const net = require('net');
const { randomInt } = require('crypto');

class QbitClient {
    constructor(){
        this.client = new net.Socket();
        this.player = null;
    }
    connect(){
        // Conectar al servidor en la IP local (ajusta la IP según la red)
        this.client.connect(3000, '192.168.X.X', () => {
            console.log('Conectado al servidor');
        });

        this.client.on('data', (data) => {
            const messages = data.toString().split("\n").filter(msg => msg.trim() !== "");
            messages.forEach(msg => {
                //el cliente hace algo dependiendo del tipo de mensaje recibido
                try {
                    const message = JSON.parse(msg);
                    if (message.hand) {
                        this.player = new PlayerController(message.player, message.hand);
                        console.log(`Jugador ${message.player} creado con mano:`, message.hand);
                    } else if (message.turn) {
                        console.log('Servidor:', message.turn);
                        //se ejecuta automáticamente escogiendo la primera carta o hasta encontrar una carta válida y con un timpo aleatorio para simular un jugador humano
                        setTimeout(() => this.makeMove(0), randomInt(1000, 2000));
                    }else if (message.newCard) {
                        console.log('Tipo:', message.newCard.cardType);
                        console.log('Carta recibida:', message.newCard);
                        this.player.GiveCard(message.newCard);
                    }
                    else if (message.message) {
                        console.log('Servidor:', message.message);
                    }
                } catch (e) {
                    console.log('Error al procesar mensaje:', e);
                    console.log('Mensaje del servidor:', data.toString());
                }
        })});

        this.client.on('close', () => {
            console.log('Conexión cerrada');
            console.log(this.player);
        });

        
    }

    makeMove(cardIndex) {
        console.log('Haciendo movimiento...');
        if (this.player && this.player.hand.length >= cardIndex) {
            const card = this.player.MoveBall(cardIndex);     
            console.log(`Jugando carta ${cardIndex}`);
            console.log(`Carta jugada:`, card);
            //si la carta es nula, se juega la siguiente
            if (card === null) {
                this.makeMove(cardIndex+1);
            }else{
                this.client.write(JSON.stringify({ card }));
            }
        
        }
    }
}

const client = new QbitClient();
client.connect();
