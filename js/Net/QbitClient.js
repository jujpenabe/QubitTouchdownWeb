const PlayerController = require('../Game/PlayerController');
const net = require('net');
const { randomInt } = require('crypto');

class QbitClient {
    constructor(){
        this.client = new net.Socket();
        this.player = null;
        this.position = null;
        this.turn = false;
        this.serverIp = null;
    }
    connect(){
        // Conectar al servidor en la IP local (ajusta la IP según la red)
        this.client.connect(3000, this.serverIp, () => {
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
                        this.turn = true;
                        //se ejecuta automáticamente escogiendo la primera carta o hasta encontrar una carta válida y con un timpo aleatorio para simular un jugador humano
                        //Modificar para que el jugador elija la carta a jugar y comentar la siguiente línea
                        setTimeout(() => this.MakeMove(0), randomInt(1000, 2000));
                    }else if (message.newCard) {
                        console.log('Tipo:', message.newCard.cardType);
                        console.log('Carta recibida:', message.newCard);
                        this.player.GiveCard(message.newCard);
                    }
                    else if (message.position) {
                        console.log('Posición del balón:', message.position);
                        this.position = message.position;
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

    MakeMove(cardIndex) {
        console.log('Haciendo movimiento...');
        this.turn = false;
        if (this.player && this.player.hand.length >= cardIndex) {
            const card = this.player.MoveBall(cardIndex);     
            console.log(`Jugando carta ${cardIndex}`);
            console.log(`Carta jugada:`, card);
            //si la carta es nula, se juega la siguiente
            if (card === null) {
                this.MakeMove(cardIndex+1);
            }else{
                this.client.write(JSON.stringify({ card }));
            }
        
        }
    }

    SetIp(ip){
        if (typeof ip !== 'string') {
            throw new Error('La IP debe ser una cadena de texto.');
        }
        this.serverIp = ip;
    }

    GetHand(index){
        if (index == undefined){
            return this.player.hand;
        }
        return this.player.hand[index];
    }

    GetPosition(){
        return this.position;
    }

    IsTurn(){
        return this.turn;
    }
}

//Ejemplo de uso:
//const client = new QbitClient();
//client.SetIp('192.168.X.X');
//client.connect();
