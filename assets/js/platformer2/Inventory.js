import GameEnv from './GameEnv.js';
import Character from './Character.js';
import GameControl from './GameControl.js';

/**
 * @class Inventory class
 * @description Simplified inventory class for playing animations.
 * @extends Character
 */
export class Inventory extends Character {
    constructor(canvas, image, data, xPercentage, yPercentage, minPosition) {
        super(canvas, image, data);
        //Initial Position  X
        this.x = xPercentage * GameEnv.innerWidth;
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;
        this.inventoryY = yPercentage;


        
        if (GameEnv.destroyedMushroom = true) {
            //
        }

        this.data = data;
        this.pressedKeys = {};
        this.isIdle = true;
    

        // Store a reference to the event listener function
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);
    
        // Add event listeners
        document.addEventListener('keydown', this.keydownListener);
        document.addEventListener('keyup', this.keyupListener);

    }
    

    /**
     * Set animation based on the provided key.
     * @param {string} key - The key representing the animation to set.
     */
    setAnimation(key) {
        const animation = this.data[key];
    
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
    
        // Method to hide the coin
        hide() {
            this.canvas.style.display = 'none';
        }
    
        // Method to show the coin
        show() {
            this.canvas.style.display = 'block';
        }

    /**
     * Handles the keydown event.
    * @param {Event} event - The keydown event.
    */
    handleKeyDown(event) {
        const key = event.key;
        if (this.data.hasOwnProperty(key)) {
            this.setAnimation(key);
            this.isIdle = false;
            this.show();  // Show the sprite when a key is pressed
        } else if (key === 'y') {
            this.hide();
        }
    }

    /**
     * Handles the keyup event.
     * @param {Event} event - The keyup event.
     */
    handleKeyUp(event) {
        // Comment out the following lines to keep the sprite at the current frame
        // const key = event.key;
        // if (this.data.hasOwnProperty(key)) {
        //     this.setAnimation(key);
        //     this.isIdle = true;
        //     this.hide();  // Hide the sprite when a key is released
        // }

        // If you want to hide the sprite when any key is released, uncomment the following line
        // this.hide();
    }
}

export default Inventory;
