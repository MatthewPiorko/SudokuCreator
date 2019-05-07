module.exports = {
  debug: function(str) {
    console.log(str);
  },
  printSudoku: function(grid) {
    console.log('');

    for (i = 0; i < 9; i++) {
      line = ' ';
      for (j = 0; j < 9; j++) {
        if (j == 9) {
          line += grid[i][j];
        } else if (j > 0 && j % 3 == 0) {
          line += '| ' + grid[i][j] + ' ';
        } else {
          line += grid[i][j] + ' ';
        }
      }

      if (i > 0 && i % 3 == 0) {
        console.log(`-------+-------+-------`)
      }
      console.log(line);
    }

    console.log('');
  }
}