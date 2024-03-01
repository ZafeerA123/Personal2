import GameEnv from './GameEnv.js';
import Character from './Character.js';
import GameControl from './GameControl.js';
import playJump from './Audio1.js';
import playplayer1Death from './Audio2.js';

/**
 * @class player1 class
 * @description player1.js key objective is to eent the user-controlled character in the game.   
 * 
 * The player1 class extends the Character class, which in turn extends the GameObject class.
 * Animations and events are activated by key presses, collisions, and gravity.
 * WASD keys are used by user to control The player1 object.  
 * 
 * @extends Character
 */
export class player1 extends Character {
    // instantiation: constructor sets up player1 object 
    constructor(canvas, image, data, widthPercentage = 0.3, heightPercentage = 0.8) {
        super(canvas, image, data, widthPercentage, heightPercentage);
        // player1 Data is required for Animations
        this.player1Data = data;
        GameEnv.invincible = false; 

        // player1 control data
        this.moveSpeed = this.speed * 3;
        this.pressedKeys = {};
        this.movement = {up: true, down: true, left: true, right: true};
        this.isIdle = true;
        this.directionKey = "d"; // initially facing right

        // Store a reference to the event listener function
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);

        // Add event listeners
        document.addEventListener('keydown', this.keydownListener);
        document.addEventListener('keyup', this.keyupListener);

        GameEnv.player1 = this;
        this.transitionHide = false;
        this.shouldBeSynced = true;
        this.isDying = false;
        this.isDyingR = false;
        this.timer = false;

        this.name = GameEnv.userID;
    }

    /**
     * Helper methods for checking the state of the player1.
     * Each method checks a specific condition and returns a boolean indicating whether that condition is met.
     */

    // helper: player1 facing left
    isFaceLeft() { return this.directionKey === "a"; }
    // helper: left action key is pressed
    isKeyActionLeft(key) { return key === "a"; }
    // helper: player1 facing right  
    isFaceRight() { return this.directionKey === "d"; }
    // helper: right action key is pressed
    isKeyActionRight(key) { return key === "d"; }
    // helper: dash key is pressed
    isKeyActionDash(key) { return key === "s"; }

    // helper: action key is in queue 
    isActiveAnimation(key) { return (key in this.pressedKeys) && !this.isIdle; }
    // helper: gravity action key is in queue
    isActiveGravityAnimation(key) {
        var result = this.isActiveAnimation(key) && (this.bottom <= this.y || this.movement.down === false);
    
        // return to directional animation (direction?)
        if (this.bottom <= this.y || this.movement.down === false) {
            this.setAnimation(this.directionKey);
        }
    
        return result;
    }

    goombaCollision() {
        if (this.timer === false) {
            this.timer = true;
            if (GameEnv.difficulty === "normal" || GameEnv.difficulty === "hard") {
                this.canvas.style.transition = "transform 0.5s";
                this.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
                playplayer1Death();

                if (this.isDying == false) {
                    this.isDying = true;
                    setTimeout(async() => {
                        await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
                        console.log("level restart")
                        this.isDying = false;
                    }, 900); 
                }
            } else if (GameEnv.difficulty === "easy") {
                this.x += 10;
            }
        }
    }
    /**
     * This helper method that acts like an animation manager. Frames are set according to player1 events.
     *  - Sets the animation of the player1 based on the provided key.
     *  - The key is used to look up the animation frame and idle in the objects player1Data.
     * If the key corresponds to a left or right movement, the directionKey is updated.
     * 
     * @param {string} key - The key representing the animation to set.
     */
    setAnimation(key) {
        // animation comes from player1Data
        var animation = this.player1Data[key]
        // direction setup
        if (this.isKeyActionLeft(key)) {
            this.directionKey = key;
            this.player1Data.w = this.player1Data.wa;
        } else if (this.isKeyActionRight(key)) {
            this.directionKey = key;
            this.player1Data.w = this.player1Data.wd;
        }
        // set frame and idle frame
        this.setFrameY(animation.row);
        this.setMaxFrame(animation.frames);
        if (this.isIdle && animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column)
            this.setMinFrame(animation.idleFrame.frames);
        }
    }
   
    /**
     * gameloop: updates the player1's state and position.
     * In each refresh cycle of the game loop, the player1-specific movement is updated.
     * - If the player1 is moving left or right, the player1's x position is updated.
     * - If the player1 is dashing, the player1's x position is updated at twice the speed.
     * This method overrides Character.update, which overrides GameObject.update. 
     * @override
     */

    update() {
        //Update the player1 Position Variables to match the position of the player1
        GameEnv.player1Position.player1X = this.x;
        GameEnv.player1Position.player1Y = this.y;

        // GoombaBounce deals with player1.js and goomba.js
        if (GameEnv.goombaBounce === true) {
            GameEnv.goombaBounce = false;
            this.y = this.y - 100;
        }

        if (GameEnv.goombaBounce1 === true) {
            GameEnv.goombaBounce1 = false; 
            this.y = this.y - 250
        } 

        // player1 moving right 
        if (this.isActiveAnimation("a")) {
            if (this.movement.left) this.x -= this.isActiveAnimation("s") ? this.moveSpeed : this.speed;  // Move to left
        }
        // player1 moving left
        if (this.isActiveAnimation("d")) {
            if (this.movement.right) this.x += this.isActiveAnimation("s") ? this.moveSpeed : this.speed;  // Move to right
        }
        // player1 moving at dash speed left or right 
        if (this.isActiveAnimation("s")) {}

        // player1 jumping
        if (this.isActiveGravityAnimation("w")) {
            playJump();
            if (this.gravityEnabled) {
                if (GameEnv.difficulty === "easy") {
                    this.y -= (this.bottom * .50);  // bottom jump height
                } else if (GameEnv.difficulty === "normal") {
                    this.y -= (this.bottom * .40);
                } else {
                    this.y -= (this.bottom * .30);
                }
            } else if (this.movement.down === false) {
                this.y -= (this.bottom * .15);  // platform jump height
            }
        }

        //Prevent player1 from Dashing Through Tube
        let tubeX = (.80 * GameEnv.innerWidth)
        if (this.x >= tubeX && this.x <= GameEnv.innerWidth) {
            this.x = tubeX - 1;

            GameEnv.backgroundHillsSpeed = 0;
            GameEnv.backgroundMountainsSpeed = 0;
        }

        //Prevent player1 from Leaving from Screen
        if (this.x < 0) {
            this.x = 1;

            GameEnv.backgroundHillsSpeed = 0;
            GameEnv.backgroundMountainsSpeed = 0;
        }

        // Perform super update actions
        super.update();

        // To put mario in the air after stepping on the goomba
        if (GameEnv.goombaBoost === true) {
            GameEnv.goombaBoost = false;
            this.y = this.y - 150;
        }
    }

    /**
     * gameloop:  responds to level change and game over destroy player1 object
     * This method is used to remove the event listeners for keydown and keyup events.
     * After removing the event listeners, it calls the parent class's destroy player1 object. 
     * This method overrides GameObject.destroy.
     * @override
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.keydownListener);
        document.removeEventListener('keyup', this.keyupListener);

        // Call the parent class's destroy method
        super.destroy();
    }

    /**
     * gameloop: performs action on collisions
     * Handles the player1's actions when a collision occurs.
     * This method checks the collision, type of game object, and then to determine action, e.g game over, animation, etc.
     * Depending on the side of the collision, it performs player1 action, e.g. stops movement, etc.
     * This method overrides GameObject.collisionAction. 
     * @override
     */
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "tube") {
            // Collision with the left side of the Tube
            if (this.collisionData.touchPoints.other.left) {
                this.movement.right = false;
            }
            // Collision with the right side of the Tube
            if (this.collisionData.touchPoints.other.right) {
                this.movement.left = false;
            }
            // Collision with the top of the player1
            if (this.collisionData.touchPoints.other.bottom) {
                this.x = this.collisionData.touchPoints.other.x;
                this.gravityEnabled = false; // stop gravity
                // Pause for two seconds
                setTimeout(() => {   // animation in tube for 1 seconds
                    this.gravityEnabled = true;
                    setTimeout(() => { // move to end of screen for end of game detection
                        this.x = GameEnv.innerWidth + 1;
                    }, 1000);
                }, 1000);
            }
        } else {
            // Reset movement flags if not colliding with a tube
            this.movement.left = true;
            this.movement.right = true;
        }

        if (this.collisionData.touchPoints.other.id === "tree") {
            // Collision with the left side of the tree
            if (this.collisionData.touchPoints.other.left) {
                this.movement.right = false;
            }
            // Collision with the right side of the tree
            if (this.collisionData.touchPoints.other.right) {
                this.movement.left = false;
            }
            // Collision with the top of the player1
            if (this.collisionData.touchPoints.other.bottom) {
                this.x = this.collisionData.touchPoints.other.x;
                this.gravityEnabled = false; // stop gravity
                // Pause for two seconds
                setTimeout(() => {   
                    this.gravityEnabled = true;
                    setTimeout(() => { // move to end of screen for end of game detection
                        this.x = GameEnv.innerWidth + 1;
                    }, 500);
                }, 500);
            }
        } else {
            // Reset movement flags if not colliding with a tree
            this.movement.left = true;
            this.movement.right = true;
        }

        if (this.collisionData.touchPoints.other.id === "portal") {
            // Collision with the left side of the portal
            if (this.collisionData.touchPoints.other.left) {
                this.movement.right = false;
            }
            // Collision with the right side of the portal
            if (this.collisionData.touchPoints.other.right) {
                this.movement.left = false;
            }
            // Collision with the top of the player1
            if (this.collisionData.touchPoints.other.bottom) {
                this.x = this.collisionData.touchPoints.other.x;
                this.gravityEnabled = false; // stop gravity
                // Pause for two seconds
                setTimeout(() => {   
                    this.gravityEnabled = true;
                    setTimeout(() => { // move to end of screen for end of game detection
                        this.x = GameEnv.innerWidth + 1;
                    }, 1);
                }, 1);
            }
        } else {
            // Reset movement flags if not colliding with a tree
            this.movement.left = true;
            this.movement.right = true;
        }

        // Checks if collision touchpoint id is either "goomba" or "flyingGoomba"
        if (this.collisionData.touchPoints.other.id === "goomba" || this.collisionData.touchPoints.other.id === "flyingGoomba") {
            if (GameEnv.invincible === false) {
                GameEnv.goombaInvincible = true;
                // Collision with the left side of the Enemy
                if (this.collisionData.touchPoints.other.left && !this.collisionData.touchPoints.other.bottom && !this.collisionData.touchPoints.other.top && GameEnv.invincible === false && this.timer === false) {
                    setTimeout(this.goombaCollision.bind(this), 50);
                } else if (this.collisionData.touchPoints.other.right && !this.collisionData.touchPoints.other.bottom && !this.collisionData.touchPoints.other.top && GameEnv.invincible === false && this.timer === false) {
                    setTimeout(this.goombaCollision.bind(this), 50);
                }

                // Collision with the right side of the Enemy
            }
        } 

        if (this.collisionData.touchPoints.other.id === "mushroom") {
            GameEnv.destroyedMushroom = true;
            this.canvas.style.filter = 'invert(1)';
        
            setTimeout(() => {
                this.canvas.style.filter = 'invert(0)';
            }, 2000); // 2000 milliseconds = 2 seconds
        }

        //if (GameEnv.destroyedMushroom === true) {
            //GameEnv.playMessage = true;
        //}
         

        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.collisionData.touchPoints.other.left) {
                this.movement.right = false;
                this.gravityEnabled = true;
                // this.x -= this.isActiveAnimation("s") ? this.moveSpeed : this.speed;  // Move to left

            }
            if (this.collisionData.touchPoints.other.right) {
                this.movement.left = false;
                this.gravityEnabled = true;
                // this.x += this.isActiveAnimation("s") ? this.moveSpeed : this.speed;  // Move to right
            }
            if (this.collisionData.touchPoints.this.top) {
                this.movement.down = false; // enable movement down without gravity
                this.gravityEnabled = false;
                // this.y -= GameEnv.gravity;
                this.setAnimation(this.directionKey); // set animation to direction
            }}
        
        // Fall Off edge of Jump platform
        else if (this.movement.down === false) {
            this.movement.down = true;          
            this.gravityEnabled = true;
        }
    }
    
    
    

    /**
     * Handles the keydown event.
     * This method checks the pressed key, then conditionally:
     * - adds the key to the pressedKeys object
     * - sets the player1's animation
     * - adjusts the game environment
     *
     * @param {Event} event - The keydown event.
     */    
    
    handleKeyDown(event) {
        if (this.player1Data.hasOwnProperty(event.key)) {
            const key = event.key;
            if (!(event.key in this.pressedKeys)) {
                //If both 'a' and 'd' are pressed, then only 'd' will be inputted
                //Originally if this is deleted, player1 would stand still. 
                if (this.pressedKeys['a'] && key === 'd') {
                    delete this.pressedKeys['a']; // Remove "a" key from pressedKeys
                    return; //(return) = exit early
                } else if (this.pressedKeys['d'] && key === 'a') {
                    // If "d" is pressed and "a" is pressed afterward, ignore "a" key
                    return;
                }
                this.pressedKeys[event.key] = this.player1Data[key];
                this.setAnimation(key);
                // player1 active
                this.isIdle = false;
                GameEnv.transitionHide = true;
            }

            // dash action on
            if (this.isKeyActionDash(key)) {
                GameEnv.dash = true;
                this.canvas.style.filter = 'invert(1)';
            }
            // parallax background speed starts on player1 movement
            if (this.isKeyActionLeft(key) && this.x > 2) {
                GameEnv.backgroundHillsSpeed = -0.4;
                GameEnv.backgroundMountainsSpeed = -0.1;
            } else if (this.isKeyActionRight(key)) {
                GameEnv.backgroundHillsSpeed = 0.4;
                GameEnv.backgroundMountainsSpeed = 0.1;
            } 

            if (GameEnv.destroyedFlower = true)
                this.canvas.style.display = 'block';
            // Check if "u" key is pressed
            if (key === "u") {
                GameEnv.destroyedFlower = false;
            }
            if (GameEnv.destroyedFlower = false) {
                this.canvas.style.display = 'none';
            }
            /* else if (this.isKeyActionDash(key) && this.directionKey === "a") {
                 GameEnv.backgroundHillsSpeed = -0.4;
                 GameEnv.backgroundMountainsSpeed = -0.1;
             } else if (this.isKeyActionDash(key) && this.directionKey === "d") {
                 GameEnv.backgroundHillsSpeed = 0.4;
                 GameEnv.backgroundMountainsSpeed = 0.1;
            } */ // This was unnecessary, and broke hitboxes / alloswed diffusion through matter
        }
    }

    /**
     * Handles the keyup event.
     * This method checks the released key, then conditionally stops actions from formerly pressed key
     * *
     * @param {Event} event - The keyup event.
     */
    handleKeyUp(event) {
        if (this.player1Data.hasOwnProperty(event.key)) {
            const key = event.key;
            if (event.key in this.pressedKeys) {
                delete this.pressedKeys[event.key];
            }
            this.setAnimation(key);  
            // player1 idle
            this.isIdle = true;
            // dash action off
            if (this.isKeyActionDash(key)) {
                this.canvas.style.filter = 'invert(0)';
                GameEnv.dash = false;
            } 
            // parallax background speed halts on key up
            if (this.isKeyActionLeft(key) || this.isKeyActionRight(key) || this.isKeyActionDash(key)) {
                GameEnv.backgroundHillsSpeed = 0;
                GameEnv.backgroundMountainsSpeed = 0;
            }
        }
    }
}

export default player1;