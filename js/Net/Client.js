const net = require('net');

const client = new net.Socket();

// Conectar al servidor en la IP local (ajusta la IP según la red)
client.connect(3000, '192.168.X.X', () => {
    console.log('Conectado al servidor');
    
    // Enviar datos al servidor (ejemplo: jugar una carta)
    client.write('Carta Jugada: H');
});

// Escuchar la respuesta del servidor
client.on('data', (data) => {
    console.log('Estado del juego recibido:', data.toString());
});

// Manejar cierre de conexión
client.on('close', () => {
    console.log('Conexión cerrada');
});
