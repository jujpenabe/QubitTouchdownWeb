const net = require('net');
const GameManager = require('../Game/GameManager');
const game = new GameManager();

const server = net.createServer((socket) => {
    console.log('Jugador conectado:', socket.remoteAddress);

    // Recibir datos del cliente
    socket.on('data', (data) => {
        console.log('Datos recibidos:', data.toString());
        
        // Simular actualización del estado del juego
        const gameState = `Nuevo estado después de: ${data.toString()}`;
        
        // Enviar el nuevo estado del juego al cliente
        socket.write(gameState);
    });

    socket.on('close', () => {
        console.log('Jugador desconectado');
    });
});

// Escuchar en el puerto 3000
server.listen(3000, '0.0.0.0', () => {
    console.log('Servidor TCP esperando conexiones en el puerto 3000...');
});

server.on('connection', (socket) => {
    socket.on('data', (data) => {
        console.log('Acción recibida:', data.toString());

        // Simular el efecto de la carta en el juego
        game.StatesLogic();

        // Responder con el nuevo estado del juego
        socket.write(`Estado actualizado: ${game.estadoActual}`);
    });
});