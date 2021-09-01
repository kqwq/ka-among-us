import { Bean } from "./bean"
import { Room } from "./room"

class Game {
    players:Bean[] = [];
    rooms:Room[] = [];



    constructor(){
        
    }

    init() {

    }

    mainLoop() {
      console.log("hello world")
    }
}

let game = new Game()

