import GameEnv from './GameEnv.js';
import Character from './Character.js';
import GameControl from './GameControl.js';
import GameSetup from './GameSetup.js';

/**
 * @class Inventory class
 * @description Inventory.js key objective is to use keys to control different inventory items.  
 * 
 * Animations and events are activated by key presses, collisions, and gravity.
 * keys are used by the user to control The inventory object.  
 * 
 * @extends Character
 */
export class Inventory extends Character {
    constructor(canvas, image, data, widthPercentage = 0.3, heightPercentage = 0.8) {
        super(canvas, image, data, widthPercentage, heightPercentage);

        this.inventoryData = data;
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
                // Add your key-specific logic here if needed
                this.pressedKeys[event.key] = this.inventoryData[key];
                this.setAnimation(key);
                this.isIdle = false;
            }
        }
    }

    handleKeyUp(event) {
        if (this.inventoryData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (event.key in this.pressedKeys) {
                // Add your key-specific logic here if needed
                delete this.pressedKeys[event.key];
            }
            this.setAnimation(key);
            this.isIdle = true;
        }
    }

    setAnimation(key) {
                // animation comes from playerData
        var animation = this.inventoryData[key]
        // set frame and idle frame
        this.setFrameY(animation.row);
        this.setMaxFrame(animation.frames);
        if (this.isIdle && animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column)
            this.setMinFrame(animation.idleFrame.frames);
        }
    }

    // Other methods for collision, gravity, update, destroy, etc.
}

export default Inventory;
