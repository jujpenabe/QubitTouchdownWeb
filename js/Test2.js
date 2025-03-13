
// Importar GameManager
const GameManager = require('./Game/GameManager');

// Instanciar el GameManager
const game = new GameManager();

// Función para ejecutar un paso del juego automáticamente
function runSimulation() {
    console.log(`\n=== Estado Actual: ${game.estadoActual} ===`);
    console.log(`Jugador Actual: ${game.currentPlayer.playerNo}`);
    console.log(`Balón en: ${game.ball.position.type}`);
    console.log(`Puntajes -> P1: ${game.player1.playerScore}, P2: ${game.player2.playerScore}`);
    
    // Ejecutar la lógica del juego
    game.StatesLogic();
    
    // Verificar si el juego ha terminado
    if (game.estadoActual === game.Estados.END_GAME) {
        console.log("\n=== Juego Terminado ===");
        clearInterval(simulationInterval);
    }
}

// Iniciar la simulación con un intervalo de 1 segundo por turno
const simulationInterval = setInterval(runSimulation, 1000);
