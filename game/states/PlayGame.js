const PlayGame = function () {}; 
startDrag = function (s) {}; 
stopDrag = function (s) {}; 
updateMoves = function () {};
update = function () {};
levelPassed = function () {};
addChild = function () {};


let HORIZONTAL = 0;
let VERTICAL = 1;

let tileSize = 133.3333;

let gameBoard = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

// move counter stuff
let moves = "";
let movesStr = "";
let movesText;

let spaceKey;

PlayGame.prototype = {
  preload: function () {
      game.load.image("completed", "assets/images/mission-accomplished.png");
  },

  create: function () {
      let gamebg = game.add.sprite(0, 0, "roadbg");
      gamebg.height = game.height;
      gamebg.width = game.width;

      let angry = game.add.sprite(900, 200, "angry");
      game.add.existing(angry).scale.setTo(2);


    game.stage.backgroundColor = "#4EAADE";
    let bounds = game.add.sprite(0, 0, "field");
    bounds = new Phaser.Rectangle(0, 0, tileSize * 6, tileSize * 6);
    console.log("bounds", bounds);
    // bounds.scale.set(2, 2);


    // console.table("GAMEBOARD PREDRAG", gameBoard);
    this.levelData = JSON.parse(this.game.cache.getText("levels"));
    vehiclesArray = this.levelData.vehiclesArray;

    for (let i = 0; i < vehiclesArray.length; i++) {
      let veh = vehiclesArray[i];
    //   console.log(veh);
      for (let j = 0; j < veh.len; j++) {
        //setting overlap to "occupied"
        if (veh.dir == HORIZONTAL) {
          gameBoard[veh.row][veh.col + j] = 1;
        }
        if (veh.dir == VERTICAL) {
          gameBoard[veh.row + j][veh.col] = 1;
        }
      }

      //veh specs added
      let car = game.add.sprite( 
        tileSize * veh.col + tileSize * veh.dir,
        tileSize * veh.row,
        veh.spr
      );
    //   car.scale(bounds.width * 2, bounds.height * 2);

      console.log("CAR", car);

      car.angle = 90 * veh.dir;
      car.data = {
        row: veh.row,
        col: veh.col,
        dir: veh.dir,
        len: veh.len,
        spr: veh.spr
      };

      car.inputEnabled = true;
      car.input.enableDrag();
      if (veh.dir == VERTICAL) {
        car.input.allowHorizontalDrag = false;
      }
      if (veh.dir == HORIZONTAL) {
        car.input.allowVerticalDrag = false;
      }
      car.input.boundsRect = bounds;
      car.input.enableSnap(tileSize, tileSize, true, true);
      car.events.onDragStart.add(startDrag);
      car.events.onDragStop.add(stopDrag);
    };

    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },

  startDrag: function (s) {
    let i;
    let from;
    let to;

    const mainCar = car.car.data.spr("redcar");
    console.log("MAIN", mainCar);

    if (s.data.dir == HORIZONTAL) {
      from = s.data.col;
      to = s.data.col + s.data.len - 1;
      for (i = s.data.col - 1; i >= 0; i--) {
        if (gameBoard[s.data.row][i] == 0) {
          from = i;
        } else {
          break;
        }
      }
      for (i = s.data.col + s.data.len; i < 6; i++) {
        if (gameBoard[s.data.row][i] == 0) {
          to = i;
        } else {
          break;
        }
      }
      s.input.boundsRect = new Phaser.Rectangle(
        from * tileSize,
        s.y,
        (to - from + 1) * tileSize,
        tileSize
      );
    }
    if (s.data.dir == VERTICAL) {
      from = s.data.row;
      to = s.data.row + s.data.len - 1;
      for (i = s.data.row - 1; i >= 0; i--) {
        if (gameBoard[i][s.data.col] == 0) {
          from = i;
        } else {
          break;
        }
      }
      for (i = s.data.row + s.data.len; i < 6; i++) {
        if (gameBoard[i][s.data.col] == 0) {
          to = i;
        } else {
          break;
        }
      }
      s.input.boundsRect = new Phaser.Rectangle(
        s.x,
        from * tileSize,
        s.x + s.data.len * tileSize,
        (to - from + 2 - s.data.len) * tileSize
      );
    }
  },

  stopDrag: function (s) {
    for (let i = 0; i < s.data.len; i++) {
      if (s.data.dir == HORIZONTAL) {
        gameBoard[s.data.row][s.data.col + i] = 0;
      }
      if (s.data.dir == VERTICAL) {
        gameBoard[s.data.row + i][s.data.col] = 0;
      }
    }
    if (s.data.dir == HORIZONTAL) {
      s.data.col = s.x / tileSize;
      for (i = 0; i < s.data.len; i++) {
        gameBoard[s.data.row][s.data.col + i] = 1;
      }
    }
    if (s.data.dir == VERTICAL) {
      s.data.row = s.y / tileSize;
      for (i = 0; i < s.data.len; i++) {
        gameBoard[s.data.row + i][s.data.col] = 1;
      }
    }
    console.log("EL.DATA", s.data);
    // console.table("GAMEBOARD POSTDRAG", gameBoard);
  },

  update: function () {
      
    game.input.onUp.addOnce(updateMoves, this);

    if(spaceKey.isDown) {
        let win = game.add.sprite(300, 200, "completed");
        game.add.existing(win).scale.setTo(2);
    }

    if(levelPassed()) {
        console.log("YOU WIN");
    }
  },

  updateMoves: function () {
    movesStr = "Moves: ";
    movesText = game.add.text(0.5, 0.5, movesStr + moves, {
      font: "34px impact",
      fill: "black",
    });
    moves++;
    movesText.setText("Moves: " + moves);
    console.log("MOVES???", moves);
  },

  levelPassed: function(mainCar, bounds) {
      if(mainCar) {
          let _mainCar = mainCar.getBounds();
          let _bounds = bounds.getBounds();
          return Phaser.Rectangle.intersects(_mainCar, _bounds);
      }
  }
};


// ,
//         {
//             "row": 4,
//             "col": 5,
//             "dir": 1,
//             "len": 2,
//             "spr": "greencar"
//           }