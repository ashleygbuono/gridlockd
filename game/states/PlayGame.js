const PlayGame = function () {}; 
startDrag = function () {}; 
stopDrag = function () {}; 
updateMoves = function () {};
update = function () {};


let HORIZONTAL = 0;
let VERTICAL = 1;

let tileSize = 133.333;

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

PlayGame.prototype = {
//   preload: function () {
//   },

  create: function () {
      
    game.stage.backgroundColor = "#FFFFFF";
    let bounds = game.add.sprite(0, 0, "field");
    bounds = new Phaser.Rectangle(0, 0, tileSize * 6, tileSize * 6);
    // console.table("GAMEBOARD PREDRAG", gameBoard);
    this.levelData = JSON.parse(this.game.cache.getText("levels"));
    vehiclesArray = this.levelData.vehiclesArray;

    for (let i = 0; i < vehiclesArray.length; i++) {
      let veh = vehiclesArray[i];
      console.log(veh);
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
        130 * veh.col + 130 * veh.dir,
        130 * veh.row,
        veh.spr
      );

      car.angle = 90 * veh.dir;
      car.data = {
        row: veh.row,
        col: veh.col,
        dir: veh.dir,
        len: veh.len,
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
    }
  },

  startDrag: function (el) {
    console.log("EL", el);
    let i;
    let from;
    let to;

    if (el.data.dir == HORIZONTAL) {
      from = el.data.col;
      to = el.data.col + el.data.len - 1;
      for (i = el.data.col - 1; i >= 0; i--) {
        if (gameBoard[el.data.row][i] == 0) {
          from = i;
        } else {
          break;
        }
      }
      for (i = el.data.col + el.data.len; i < 6; i++) {
        if (gameBoard[el.data.row][i] == 0) {
          to = i;
        } else {
          break;
        }
      }
      el.input.boundsRect = new Phaser.Rectangle(
        from * tileSize,
        el.y,
        (to - from + 1) * tileSize,
        tileSize
      );
    }
    if (el.data.dir == VERTICAL) {
      from = el.data.row;
      to = el.data.row + el.data.len - 1;
      for (i = el.data.row - 1; i >= 0; i--) {
        if (gameBoard[i][el.data.col] == 0) {
          from = i;
        } else {
          break;
        }
      }
      for (i = el.data.row + el.data.len; i < 6; i++) {
        if (gameBoard[i][el.data.col] == 0) {
          to = i;
        } else {
          break;
        }
      }
      el.input.boundsRect = new Phaser.Rectangle(
        el.x,
        from * tileSize,
        el.x + el.data.len * tileSize,
        (to - from + 2 - el.data.len) * tileSize
      );
    }
  },

  stopDrag: function (el) {
    for (let i = 0; i < el.data.len; i++) {
      if (el.data.dir == HORIZONTAL) {
        gameBoard[el.data.row][el.data.col + i] = 0;
      }
      if (el.data.dir == VERTICAL) {
        gameBoard[el.data.row + i][el.data.col] = 0;
      }
    }
    if (el.data.dir == HORIZONTAL) {
      el.data.col = el.x / tileSize;
      for (i = 0; i < el.data.len; i++) {
        gameBoard[el.data.row][el.data.col + i] = 1;
      }
    }
    if (el.data.dir == VERTICAL) {
      el.data.row = el.y / tileSize;
      for (i = 0; i < el.data.len; i++) {
        gameBoard[el.data.row + i][el.data.col] = 1;
      }
    }
    // console.table("GAMEBOARD POSTDRAG", gameBoard);
  },

  update: function () {
      
    game.input.onUp.addOnce(updateMoves, this);
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

  
};
