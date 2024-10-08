class GameManager {
    constructor() {

        if (!!GameManager.SharedInstance) {
            return GameManager.SharedInstance;
        }
        GameManager.SharedInstance = this;

        this.Estados = {
            BEGIN: 'begin',
            IN_GAME: 'inGame',
            TOUCHDOWN: 'Touchdown',
            END_GAME: 'EndGame'
        };

        this.estadoActual = this.Estados.BEGIN;

    }

    ChangeToBegin() {
        this.estadoActual = this.estados.BEGIN;
    }

    ChangeToInGame() {
        this.estadoActual = this.estados.InGame;
    }

    ChangeToTouchDown() {
        this.estadoActual = this.estados.TouchDown;
    }

    ChangeToEndGame() {
        this.estadoActual = this.estados.EndGame;
    }


    StatesLogic() {
        if (this.estadoActual == this.estados.BEGIN) {
            //TO DO:
        }
        else if (this.estadoActual == this.estados.InGame) {
            //TO DO:
        }
        else if (this.estadoActual == this.estados.TouchDown) {
            //TO DO:
        }
        else if (this.estadoActual == this.estados.EndGame) {
            //TO DO:
        }

    }

}