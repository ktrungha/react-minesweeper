export function getHorSize(level) {
  if (level === 1) {
    return 9;
  } else if (level === 2) {
    return 16;
  } else {
    return 30;
  }
}

export function getVerSize(level) {
  if (level === 1) {
    return 9;
  } else if (level === 2) {
    return 16;
  } else {
    return 16;
  }
}

export function getMinesCount(level) {
  if (level === 1) {
    return 10;
  } else if (level === 2) {
    return 40;
  } else {
    return 99;
  }
}

export function initData(level) {
  let x = getHorSize(level);
  let y = getVerSize(level);

  let data = new Array(y);
  for (let i = 0; i < y; i++) {
    data[i] = new Array(x);
  }

  for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
      data[i][j] = {
        flag: false,
        mine: false,
        surroundingMineCount: 0,
        checked: false
      };
    }
  }

  installMines(data, getMinesCount(level));
  fillSurroundingMineCount(data, x, y);
  return data;
}

function fillSurroundingMineCount(data, x, y) {
  for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
      if (data[i][j].mine) {
        if (i > 0) {
          if (j > 0) {
            data[i - 1][j - 1].surroundingMineCount += 1;
          }
          if (j < x - 1) {
            data[i - 1][j + 1].surroundingMineCount += 1;
          }
          data[i - 1][j].surroundingMineCount += 1;
        }
        if (i < y - 1) {
          if (j > 0) {
            data[i + 1][j - 1].surroundingMineCount += 1;
          }
          if (j < x - 1) {
            data[i + 1][j + 1].surroundingMineCount += 1;
          }
          data[i + 1][j].surroundingMineCount += 1;
        }
        if (j > 0) {
          data[i][j - 1].surroundingMineCount += 1;
        }
        if (j < x - 1) {
          data[i][j + 1].surroundingMineCount += 1;
        }
      }
    }
  }
}

function installMines(data, minesCount) {
  let y = data.length;
  let x = data[0].length;
  let n = x * y;

  let array = new Array(n);
  for (let i = 0; i < n; i++) {
    array[i] = i;
  }

  // Run limited iteration of Fisher Yates shuffle
  let count = 0;
  for (let i = array.length - 1; count < minesCount; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    count++;
  }

  for (let i = 0; i < minesCount; i++) {
    let num = array[n - 1 - i];
    let row = Math.floor(num / x);
    let col = num % x;
    data[row][col].mine = true;
  }
}

export function check(r, c, data) {
  let cell = data[r][c];
  if (cell.checked) {
    return 0;
  }

  let retval = 1;
  cell.checked = true;
  if (cell.surroundingMineCount > 0) {
    return retval;
  } else {
    if (r > 0) {
      if (c > 0) {
        retval += check(r - 1, c - 1, data);
      }
      if (c < data[0].length - 1) {
        retval += check(r - 1, c + 1, data);
      }
      retval += check(r - 1, c, data);
    }
    if (r < data.length - 1) {
      if (c > 0) {
        retval += check(r + 1, c - 1, data);
      }
      if (c < data[0].length - 1) {
        retval += check(r + 1, c + 1, data);
      }
      retval += check(r + 1, c, data);
    }
    if (c > 0) {
      retval += check(r, c - 1, data);
    }
    if (c < data[0].length - 1) {
      retval += check(r, c + 1, data);
    }
    return retval;
  }
}

export function getCellColor(num) {
  if (num === 1) {
    return "blue";
  } else if (num === 2) {
    return "green";
  } else if (num === 3) {
    return "red";
  } else if (num === 4) {
    return "#000099";
  } else if (num === 5) {
    return "brown";
  } else if (num === 6) {
    return "#3399ff";
  } else if (num === 7) {
    return "black";
  } else if (num === 8) {
    return "grey";
  }
}
