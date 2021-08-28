let game = new Phaser.Game(2500, 1200, Phaser.AUTO, "game"), Main = function () {};

window.AudioContext = null;

window.webkitAudioContext = null;

Main.prototype = {

  loadScripts: function () {
    game.load.script("home", "states/HomeScreen.js");
  },

  loadImages: function () {
    game.load.image("background", "assets/images/traffic-backgroundcity.png");
    game.load.image("logo", "assets/images/gridlockd-logo.png");
  },
  //loadFonts() {},
  preload: function () {
    this.loadScripts();
    this.loadImages();
    //this.loadFonts();
  },

  create: function () {
    game.state.add("Home", Home);
    game.state.start("Home");
  },
};

game.state.add("Main", Main);
game.state.start("Main");




