let gameManager = new GameManager;
console.log(gameManager.ball.position);
console.log(gameManager.fin);
while (gameManager.fin){
    console.log(gameManager.ball.position);
    gameManager.StatesLogic();
}
console.log(gameManager.player1);
console.log(gameManager.player2);

console.log(gameManager.ball.position);
console.log(gameManager.deck.cards);
console.log(gameManager.fin);
console.log("juego terminado");
