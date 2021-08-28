const Home = function () {};

Home.prototype = {
    
    loadScripts: function() {
        game.load.script("game", "/PlayGame.js");
        // game.load.script("NextLevel", "/NextLevel.js");
        // game.load.script("GameOver", "/GameOver.js");
    },

    loadImages: function() {
        game.load.image("completed", "assets/images/completed.png");
        game.load.image("field", "./assets/sprites/field.png");
        game.load.image("redcar", "./assets/sprites/redcar.png");
        game.load.image("greycar", "./assets/sprites/greycar.png");
        game.load.image("greencar", "./assets/sprites/greencar.png");
        game.load.image("bluecar", "./assets/sprites/bluecar.png");
        game.load.image("purplecar", "./assets/sprites/purplecar.png");
        game.load.image("orangecar", "./assets/sprites/orangecar.png");
        game.load.image("pinkcar", "./assets/sprites/pinkcar.png");
        game.load.image("yellowtruck", "./assets/sprites/yellowtruck.png");
        game.load.image("purpletruck", "./assets/sprites/purpletruck.png");
    },

    // init: function() {
    //     t
    // },

    preload: function () {
        this.loadScripts();
        this.loadImages();

        this.load.text("levels", "assets/data/levels.json");

    },

    addGameStates: function () {
        game.state.add("PlayGame", PlayGame);
        // game.state.add("NextLevel", NextLevel);
        // game.state.add("GameOver", GameOver);
    },

    create: function() {
       let bg = game.add.sprite(0, 0, "background");
       bg.width = game.width;
       bg.height = game.height;

       let logo = game.add.sprite(game.width / 4,  game.height / 4, "logo");
    //    logo.anchor.setTo(0.5, 0.75);
        game.add.existing(logo).scale.setTo(2);
        game.stage.disableVisibilityChange = true;
        let startText = game.add.text(1100, 630, "Start", {
            font: "75px impact",
            fill: "white",
            align: "center"
        });

        startText.inputEnabled = true;
        startText.useHandCursor = true;
        startText.events.onInputOver.add(function(target) {
            target.fill = "red";
        });
        startText.events.onInputOut.add(function(target) {
            target.fill = "white";
        });
        startText.events.onInputUp.add(function() {
            game.state.start("PlayGame")
        });

        this.addGameStates();
    }
};


