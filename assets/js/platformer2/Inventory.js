import GameEnv from './GameEnv.js';
import Character from './Character.js';
import GameControl from './GameControl.js';

/**
 * @class Inventory class
 * @description Simplified inventory class for playing animations.
 * @extends Character
 */
export class Inventory extends Character {
    constructor(canvas, image, data, xPercentage, yPercentage) {
        super(canvas, image, data);
        this.inventoryX = xPercentage * GameEnv.innerWidth;
        this.inventoryY = yPercentage * GameEnv.innerHeight;
        this.inventoryData = data;
        this.pressedKeys = {};
        this.isIdle = true;
    

        // Store a reference to the event listener function
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);
    
        // Add event listeners
        document.addEventListener('keydown', this.keydownListener);
        document.addEventListener('keyup', this.keyupListener);

    }

    // helper: player facing left
    isFaceLeft() { return this.directionKey === "m"; }
    // helper: left action key is pressed
    //isKeyActionLeft(key) { return key === "m"; }
    // helper: player facing right  
    isFaceRight() { return this.directionKey === "y"; }
    // helper: right action key is pressed
    isKeyActionRight(key) { return key === "u"; }
    // helper: dash key is pressed
    isKeyActionDash(key) { return key === "r"; }


    // helper: action key is in queue 
    isActiveAnimation(key) { return (key in this.pressedKeys) && !this.isIdle; }

    /**
     * Set animation based on the provided key.
     * @param {string} key - The key representing the animation to set.
     */
    setAnimation(key) {
        const animation = this.inventoryData[key];
    
        if (this.isIdle && animation.idleFrame) {
            this.setFrameY(animation.idleFrame.row);
            this.setMinFrame(animation.idleFrame.frames);
        } else {
            this.setFrameY(animation.row);
            this.setMinFrame(1);
        }
    
        this.setMaxFrame(animation.frames);
    
        if (!this.isIdle) {
            this.setFrameX(1);
        } else {
            this.setFrameX(1);
        }
    }
    

    /**
     * Handles the keydown event.
     * @param {Event} event - The keydown event.
     */
    handleKeyDown(event) {
        const key = event.key;
        if (this.inventoryData.hasOwnProperty(key)) {
            this.setAnimation(key);
            this.isIdle = false;
        }
    }

    /**
     * Handles the keyup event.
     * @param {Event} event - The keyup event.
     */
    handleKeyUp(event) {
        const key = event.key;
        if (this.inventoryData.hasOwnProperty(key)) {
            this.setAnimation(key);
            //this.isIdle = true;
        }
    }
}

export default Inventory;
