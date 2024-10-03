let shared = { turn: 0, state: 'waiting' };  // Objeto compartido inicial
let connectionManager;

function setup() {
  createCanvas(400, 400);

  // Inicializar el ConnectionManager con el objeto compartido
  connectionManager = new ConnectionManager(shared, (updatedShared) => {
    // Esta función se ejecuta cuando se recibe una actualización del otro jugador
    shared = updatedShared;
    console.log('Objeto compartido actualizado en sketch: ', shared);
  });

  // Inicializar la conexión como host o cliente
  let isInitiator = location.hash === '#host';  // Define si el jugador es el iniciador
  connectionManager.initConnection(isInitiator);
}

function draw() {
  background(220);
  text(`Turno actual: ${shared.turn}`, 10, 20);

  if (mouseIsPressed) {
    // Actualiza el objeto compartido cuando el jugador interactúa
    shared.turn++;
    connectionManager.updateSharedObject(shared);  // Actualizar el ConnectionManager
  }
}