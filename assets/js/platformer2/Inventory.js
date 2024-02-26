import GameEnv from './GameEnv.js';
import Character from './Character.js';
import GameControl from './GameControl.js';
import playJump from './Audio1.js';
import playPlayerDeath from './Audio2.js';
import Socket from './Multiplayer.js';


/**
 * @class Inventory class
 * @description Inventory.js key objective is to use keys to control different inventory items.  
 * 
 * Animations and events are activated by key presses, collisions, and gravity.
 * keys are used by user to control The inventory object.  
 * 
 */
export class Inventory {
    constructor(canvas, image, data, widthPercentage = 0.3, heightPercentage = 0.8) {
        this.canvas = canvas;
        this.image = image;
        this.inventoryData = data;
        this.widthPercentage = widthPercentage;
        this.heightPercentage = heightPercentage;
        this.pressedKeys = {};
        this.isIdle = true;

        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);

        document.addEventListener('keydown', this.keydownListener);
        document.addEventListener('keyup', this.keyupListener);

        this.init();
    }

    init() {
        // Additional setup logic if needed
    }

    handleKeyDown(event) {
        if (this.inventoryData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (!(event.key in this.pressedKeys)) {
                this.pressedKeys[event.key] = this.inventoryData[key];
                this.playAnimation(key);
                this.isIdle = false;
            }
        }
    }

    handleKeyUp(event) {
        if (this.inventoryData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (event.key in this.pressedKeys) {
                delete this.pressedKeys[event.key];
            }
            this.playAnimation(key);
            this.isIdle = true;
        }
    }

    playAnimation(key) {
        // Simplified play animation logic, replace with your own
        var animation = this.inventoryData[key];
        this.setFrameY(animation.row);
        this.setMaxFrame(animation.frames);
        if (this.isIdle && animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column)
            this.setMinFrame(animation.idleFrame.frames);
        }
        // Add more logic for direction setup or other specific animation details
    }

    // Other methods for collision, gravity, update, destroy, etc.
}

export default Inventory;
