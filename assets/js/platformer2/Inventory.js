import Character from './Character.js';

/**
 * @class Inventory class
 * @description Simplified inventory class for playing animations.
 * @extends Character
 */
export class Inventory extends Character {
    constructor(canvas, image, data, widthPercentage = 0.3, heightPercentage = 0.8) {
        super(canvas, image, data, widthPercentage, heightPercentage);
        this.inventoryData = data;
        this.pressedKeys = {};
        this.movement = {up: true, down: true, left: true, right: true};
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
        } else if (animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column);
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
            this.isIdle = true;
        }
    }
}

export default Inventory;
