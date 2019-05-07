const express = require('express');

const config = require('./config');
const util = require('./util/util');

const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname));
app.listen(config.port, () => { util.debug(`App started on port ${config.port}`); });

DEFAULT_ALPHABET = 'α,β,γ,δ,ε,ζ,η,Θ,π';

app.get('/', function(req, res) {
  if (req.query.alphabet == undefined) {
    alphabet = DEFAULT_ALPHABET.split(',');
  } else {
    alphabet = req.query.alphabet.split(',');
    if (alphabet.length != 9) {
      alphabet = DEFAULT_ALPHABET.split(',');
    }
  }
  grid = createSudoku(alphabet);

	res.render('main', grid)
});

let copyGrid = function(grid) {
  newGrid = [];

  for (i = 0; i < 9; i++) {
    newGrid.push(grid[i].slice());
  }

  return newGrid;
}

// Fisher-Yates shuffle
let shuffle = function(arr) {
  var index;
  var temp;
  var len = arr.length;

  for (i = len - 1; i > 0; i--) {
    index = Math.floor(Math.random() * (i + 1));
    temp = arr[index];

    arr[index] = arr[i];
    arr[i] = temp;
  }
}

let shift = function(arr, n) {
  if (n == 0) return arr;

  let len = arr.length;
  let firstPart = arr.splice(0, n)

  return arr.concat(firstPart)
}

let iterateSudoku = function(grid, fun) {
  for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
      fun(grid, i, j);
    }
  }
}

let createSudoku = function(alphabet) {
  let base = [1,2,3,4,5,6,7,8,9];

  let grid = [];

  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      // Copy array to use multiple times
      let nextRow = base.slice();
      nextRow = shift(nextRow, j*3 + i);

      grid.push(nextRow);
    }
  }

  grid = scramble(grid);

  if (alphabet) {
    shuffle(alphabet);
    let replace = function(grid, i, j) {
      let val = grid[i][j];
      let oldIndex = base.findIndex(x => x == val);

      grid[i][j] = alphabet[oldIndex];
    }

    iterateSudoku(grid, replace);
  }

  hideCells(grid, 40);

  return grid;  
}

let createRandomOrder = function() {
  let order = [[0,1,2],[3,4,5],[6,7,8]];
  order.forEach(x => shuffle(x));
  order = [].concat.apply([], order);

  return order;
}

let rearrangeColumns = function(grid, order) {
  newGrid = copyGrid(grid);

  for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
      oldCol = order[j];
      newGrid[i][j] = grid[i][oldCol];
    }
  }

  return newGrid;
}

let rearrangeRows = function(grid, order) {
  newGrid = copyGrid(grid);

  for (i = 0; i < 9; i++) {
    oldRow = order[i];
    for (j = 0; j < 9; j++) {
      newGrid[i][j] = grid[oldRow][j];
    }
  }

  return newGrid;
}

let scramble = function(grid) {
  //Scramble columns
  for (i = 0; i < 10; i++) {
    grid = rearrangeColumns(grid, createRandomOrder());
  }

  //Scramble rows
  for (i = 0; i < 10; i++) {
    grid = rearrangeRows(grid, createRandomOrder());
  }

  return grid;
}

let hideCells = function(grid, numberToHide) {
  let numberHidden = 0;

  while (numberHidden < numberToHide) {
    index = Math.floor(Math.random() * 81);

    i = Math.floor(index / 9);
    j = index % 9;

    if (grid[i][j] == '') {
      continue;
    } else {
      grid[i][j] = '';
      numberHidden++;
    }
  }
}