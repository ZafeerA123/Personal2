import LocalStorage from "./LocalStorage.js";
import GameEnv from "./GameEnv.js";
import GameControl from "./GameControl.js";

export class Controller extends LocalStorage{
    constructor(){
        var keys = {currentLevel:"currentLevel",gameSpeed:"gameSpeed"}; //default keys for localStorage
        super(keys); //creates this.keys

         // Create a flashing message element
        this.flashingMessage = document.createElement("div");
        this.flashingMessage.className = "flashing-message";
        this.flashingMessage.innerText = "Don't Skip to End";
        document.body.appendChild(this.flashingMessage);
        
    }
    //separated from constructor so that class can be created before levels are added
    initialize(){ 
        this.loadAll(); // load data
        
        if(this[this.keys.currentLevel]){ //update to active level
            GameControl.transitionToLevel(GameEnv.levels[Number(this[this.keys.currentLevel])]);
        }
        else{ //if not currentLevel then set this.currentLevel to 0 (default)
            this[this.keys.currentLevel] = 0;
        }

        if(this[this.keys.gameSpeed]){ //update to custom gameSpeed
           GameEnv.gameSpeed = Number(this[this.keys.gameSpeed]);
        }
        else{ //if not gameSpeedthen set this.gameSpeed to GameEnv.gameSpeed (default)
            this[this.keys.gameSpeed] = GameEnv.gameSpeed;
        }
        
        window.addEventListener("resize",()=>{ //updates this.currentLevel when the level changes
            this[this.keys.currentLevel] = GameEnv.levels.indexOf(GameEnv.currentLevel);
            this.save(this.keys.currentLevel); //save to local storage
        });
        window.addEventListener("speed",(e)=>{ //updates this.gameSpeed when a speed event is fired
            this[this.keys.gameSpeed] = e.detail.speed();
            GameEnv.gameSpeed = this[this.keys.gameSpeed]; //reload or change levels to see effect
            this.save(this.keys.gameSpeed); //save to local storage
        })
        // Add an event listener to show/hide the flashing message when the settings bar is opened/closed
       window.addEventListener("resize", () => {
        this[this.keys.currentLevel] = GameEnv.levels.indexOf(GameEnv.currentLevel);
        this.save(this.keys.currentLevel); //save to local storage
        this.toggleFlashingMessage(); // Toggle flashing message
    });
 
    }
    get levelTable(){
        var t = document.createElement("table");
        //create header
        var header = document.createElement("tr");
        var th1 = document.createElement("th");
        th1.innerText = "#";
        header.append(th1);
        var th2 = document.createElement("th");
        th2.innerText = "Level Tag";
        header.append(th2);
        t.append(header);

        //create other rows
        for(let i = 0;i < GameEnv.levels.length;i++){
            var row = document.createElement("tr");
            var td1 = document.createElement("td");
            td1.innerText = String(i);
            row.append(td1);
            var td2 = document.createElement("td");
            td2.innerText = GameEnv.levels[i].tag;
            td2.addEventListener("click",()=>{ // when player clicks on level name
                GameControl.transitionToLevel(GameEnv.levels[i]); //transition to that level
            })
            row.append(td2);
            t.append(row);
        }

        return t; //returns <table> element
    }
    get speedDiv(){
        var div = document.createElement("div"); //container

        var a = document.createElement("a"); //create text
        a.innerText = "Game Speed";
        div.append(a);

        var input1 = document.createElement("input"); //create inputfeild
        input1.type = "number"; //type number (1234...)
        const event = new CustomEvent("speed", { detail: {speed:()=>input1.value} });
        input1.addEventListener("input",()=>{ //after input feild is edited
            window.dispatchEvent(event); //dispatch event to update game speed
        })
        div.append(input1);
    }
    toggleFlashingMessage() {
        // Toggle the visibility of the flashing message
        this.flashingMessage.style.display = "block";

        // Set a timeout to hide the flashing message after a short delay
        setTimeout(() => {
            this.flashingMessage.style.display = "none";
        }, 20000); // Adjust the delay as needed
        return div; //returns <div> element
    }
}

export default Controller;
