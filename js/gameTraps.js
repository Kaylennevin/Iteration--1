class BaseTrap extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.body = new Phaser.Physics.Arcade.Body(scene.physics.world, this);
        this.body.setAllowRotation(true)


        scene.physics.add.existing(this);
        scene.add.existing(this);
    }
}

class DamageTrap extends BaseTrap {
    constructor(scene, x, y, texture, damage) {
        super(scene, x, y, texture);

        this.damage = damage;
    }
}

/**
 * This is a blade
 * @extends DamageTrap
 */
class Blade extends DamageTrap {
    /**
     * 
     * @param {Phaser.Scene} scene - The scene of the game
     * @param {number} x The x position of the blade
     * @param {number} y The y position of the blade
     * @param {string} texture The sprite texture key
     * @param {number?} rotation (Optional) The rotation of the sprite in degrees. Default 0.
     * @param {number?} scale (Optional) The scale of the sprite. Default 1.
     */
    constructor(scene, x, y, texture, rotation = 0, scale = 1, bladeDelay = 2000) {
        super(scene, x, y, texture, 2);

        this.setScale(scale);

        this.setAngle(rotation);
        if (rotation == 90 || rotation == 270) {
            this.setDisplayOrigin(this.body.height / 2);
            let tempHeight = this.body.height;
            this.body.height = this.body.width;
            this.body.width = tempHeight;
        }

        if (rotation == 270) {
            this.setDisplayOrigin(this.body.height / 2);
        }



        this.setImmovable(true);

        this.sheathed = true;

        this.timer = this.scene.time.addEvent({
            delay: bladeDelay,
            callback: this.toggleSheath,
            callbackScope: this,
            loop: true
        });
    }

    toggleSheath() {
        this.sheathed = !this.sheathed;

        if (this.sheathed) {
            this.unSheath();
        } else {
            this.sheath()
        }


    }

    unSheath() {
        this.setTexture(this.texture, 2);
        // this.anims.play("bladeAnim", true);
        this.body.setEnable(true);

    }

    sheath() {
        this.setTexture(this.texture, 0);
        // this.anims.stop("bladeAnim",);
        this.body.setEnable(false);

    }

    idle() {
        this.setTexture(this.texture, 1);
        this.body.setEnable(false);
    }
}
/** 
@extends DamageTrap
*/

class CircleBlade extends DamageTrap {
  /**
   * 
   * @param {*} scene 
   * @param {*} x 
   * @param {*} y 
   * @param {*} texture 
   * @param {*} scale 
   * @param {*} velocityX 
   * @param {*} velocityY 
   */
    constructor(scene, x, y, texture, scale = 1, velocityX = 0, velocityY = 0) {
        super(scene, x, y, texture, 10);

        this.setScale(scale);
        this.setImmovable(true);
        this.setVelocityX(velocityX);
        this.setVelocityY(velocityY);
        this.setBounce(2);
        this.setMaxVelocity(300);
        



    }

  




}