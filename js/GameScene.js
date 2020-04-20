class GameScene extends Phaser.Scene {
    map;
    collideLayer;
    player;
    playerHealth = 100;
    UIScene;
    activePointers;


    constructor(config) {
        super(config);
    }

    preload() {

        this.load.image("player", "assets/player.png");
        this.load.image("sandTiles", "assets/sandstone-tiles.png");

        this.load.tilemapTiledJSON("tilemap", "assets/sand-map-1.json");

        this.load.image("bladeTexture", "assets/blade.png");
        this.load.spritesheet("blade", "assets/bladewip.png", {
            frameWidth: 224,
            frameHeight: 32
        });

        this.load.spritesheet("bladesmall", "assets/bladewipsmall.png", {
            frameWidth: 160,
            frameHeight: 32
        });

        this.load.spritesheet("circlesaw", "assets/circlesawwip.png", {
            frameWidth: 32,
            frameHeight: 32
        });

    }

    create() {



        this.UIScene = this.scene.get("UIScene");
        //this.UIScene.createUIScene(this.scene.key);
        this.scene.launch(this.UIScene);

        // load in the tilemap
        this.map = this.make.tilemap({
            key: "tilemap"
        });

        // add the tileset images to the tilemap
        this.map.sandTiles = this.map.addTilesetImage("sandstone-tiles", "sandTiles")

        this.map.createStaticLayer("background", this.map.sandTiles);
        this.map.createStaticLayer("collide", this.map.sandTiles);



        this.createTrap();
        this.createPlayer();
        this.enableCollision();


        this.displayHealth = this.add.text(20, 660, "HEALTH: 100%", {
            font: "34px Lucida Console",
            fill: "#fff",
            stroke: "#000000",
            strokeThickness: 3,
            backgroundColor: "#000000",
            padding: 10,

        });
        this.displayHealth.setScrollFactor(0);
        this.displayHealth.setDepth(10);



        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
        this.cameras.main.setBounds(0, -100, 1800, 900);
        this.cameras.main.setBackgroundColor('rgba(56, 44, 34, 1)');









        this.keyPress = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            dash: Phaser.Input.Keyboard.KeyCodes.SPACE
        });


    }

    update() {


        // move the player up when up arrow key is pressed
        if (this.keyPress.up.isDown) {
            this.player.body.setVelocity(0, -400);
        }

        // move the player down when down arrow key is pressed
        else if (this.keyPress.down.isDown) {
            this.player.body.setVelocity(0, 400);
        }

        // move the player left when left arrow key is pressed
        else if (this.keyPress.left.isDown) {
            this.player.body.setVelocity(-400, 0);
        }

        // move the player right when right arrow key is pressed
        else if (this.keyPress.right.isDown) {
            this.player.body.setVelocity(400, 0);
        } else {
            //this.player.body.setVelocity(0, 0);
        }

        var pointerList = this.scene.scene.input.manager.pointers;

        
        this.activePointers = 0;

        for (var i = 0; i < pointerList.length; i++)
        {   
          
            var pointer = pointerList[i]; 
            if(pointer.isDown) {
                this.activePointers++;
            }

            //console.log(pointer);
            
        }
        console.log(this.activePointers);

        if (this.activePointers == 0) { 
            this.player.body.setVelocity(0, 0);

        }


        

    }

    enableCollision() {
        this.collideLayer = this.map.getLayer("collide").tilemapLayer;
        this.collideLayer.setCollisionBetween(0, 1000);
        this.physics.add.collider(this.player, [this.collideLayer]);
        this.physics.add.collider(this.trap, [this.collideLayer]);
        this.physics.add.collider(this.player, [this.trap, this.trap2, this.trap3, this.trap4, this.trap5, this.trap6, this.trap7], this.player.hurt, null, this);
        this.physics.add.collider(this.player, this.circleblade, this.player.hurt, null, this);
        this.physics.add.collider(this.circleblade, this.collideLayer, this.changeDirection, null, this);

        console.log(this);



    }



    createPlayer() {
        this.player = this.physics.add.sprite(100, this.cameras.main.height / 2, 'player');
        this.player.enableBody(true, this.player.x, this.player.y, true, true)
        this.player.body.setCollideWorldBounds(true);
        this.add.sprite()


        this.player.hurt = function (player, trap) {
            console.log("Player takes: " + trap.damage + " damage!");
            console.log(this.playerHealth);
            this.playerHealth = this.playerHealth - trap.damage;
            this.gameOver();
            this.updateDisplayHealth();
            if (this.playerHealth <= 0) {
                this.playerHealth === 0;
            }

        }
    }

    createTrap() {
        this.trap = new Blade(this, 655, 80, "blade", 90, 1, 700);
        this.trap2 = new Blade(this, 655, 550, "blade", 270, 1, 1100);
        this.trap3 = new Blade(this, 528, 577, "bladesmall", 270, 1, 1000);
        this.trap4 = new Blade(this, 367, 500, "bladesmall", 90, 1, 1100);
        this.trap5 = new Blade(this, 333, 577, "bladesmall", 270, 1, 1000);

        this.trap6 = new Blade(this, 685, 80, "blade", 90, 1, 700);
        this.trap7 = new Blade(this, 715, 80, "blade", 90, 1, 700);

        this.circleblade = new CircleBlade(this, 995, 120, "circlesaw", 2, 0, 500);



    }

    gameOver() {
        if (this.playerHealth <= 0) {
            this.scene.pause();
            this.gameOverText = this.add.text(320, 250, "GAME OVER!", {
                font: "110px Arial Black",
                fill: "#D80000",
                stroke: "#6C0000",
                strokeThickness: 3,
                align: "center"


            })
            this.gameOverText.setDepth(6);
            this.gameOverText.setShadow(5, 5, "#000", 10);
            this.gameOverText.setScrollFactor(0);

        }
    }

    updateDisplayHealth() {
        this.displayHealth.setText("HEALTH: " + this.playerHealth + "%");

    }



    changeDirection() {
        if (this.circleblade.body.blocked.down) {
            this.circleblade.setVelocityY(0);
            this.circleblade.setVelocityX(500);
        } else if (this.circleblade.body.blocked.right) {
            this.circleblade.setVelocityX(0);
            this.circleblade.setVelocityY(-500);
        } else if (this.circleblade.body.blocked.up) {
            this.circleblade.setVelocityY(0);
            this.circleblade.setVelocityX(-500);
        } else if (this.circleblade.body.blocked.left) {
            this.circleblade.setVelocityX(0);
            this.circleblade.setVelocityY(500);
        }




    }

}

class UIScene extends Phaser.Scene {
    constructor() {
        super("UIScene");

    }

    create(){
        let gameScene = this.scene.manager.scenes[0];
        console.log("uiscene create");

        let leftButton = new Button(this, 20, 20, "leftButton", function () {
           console.log("left") ;
        //    gameScene.player.body.setVelocity(-400, 0);
        gameScene.player.body.setVelocity(0, 400);

        });
        leftButton.setScale(11,21);
        leftButton.setAlpha(0.1);


        console.log(this.scene);
        this.add.existing(leftButton);

    }







}