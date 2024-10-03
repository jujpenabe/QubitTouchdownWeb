// Module to manage P2P connections
class ConnectionManager {
  constructor(sharedObject, onUpdateCallback) {
    this.peer = null;
    this.shared = sharedObject; // El objeto compartido entre los jugadores
    this.onUpdateCallback = onUpdateCallback; // Función que se llama al recibir datos
  }

  initConnection(isInitiator) {
    this.peer = new SimplePeer({
      initiator: isInitiator, // true si el jugador es el host
      trickle: false
    });

    // Manejar señalización
    this.peer.on('signal', (data) => {
      console.log('Señal generada: ', JSON.stringify(data));
      // Aquí se puede implementar la lógica para compartir la señal con el otro jugador
    });

    // Recibir la señal de otro jugador e inicializar la conexión
    document.getElementById('connectButton').addEventListener('click', () => {
      const signal = document.getElementById('signalInput').value;
      this.peer.signal(JSON.parse(signal));
    });

    // Conexión establecida
    this.peer.on('connect', () => {
      console.log('Conexión establecida');
      this.sendData();  // Enviar el objeto compartido al conectar
    });

    // Recibir datos del otro jugador
    this.peer.on('data', (data) => {
      this.shared = JSON.parse(data);  // Actualizar el objeto compartido
      console.log('Objeto compartido recibido: ', this.shared);
      this.onUpdateCallback(this.shared);  // Notificar al sketch sobre la actualización
    });
  }

  // Enviar el objeto compartido
  sendData() {
    if (this.peer && this.peer.connected) {
      this.peer.send(JSON.stringify(this.shared));
    }
  }

  // Actualizar el objeto compartido y enviarlo
  updateSharedObject(newSharedObject) {
    this.shared = newSharedObject;
    this.sendData();
  }
}
