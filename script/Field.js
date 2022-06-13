

class Field {
  constructor(canvas, game, rowsAm = 20, columnsAm = 10) {
    this.game = game;
    this.rowsAm = rowsAm;
    this.columnsAm = columnsAm;
    this.canvas = canvas;
    this.innerBorderWidth = 0;
    this.backgroundColor = 'white';
    this.updateSizes();
    this.initCells()
    this.ctx = canvas.getContext('2d');
    this.gameOver = false;
    this.render();
  }

  updateSizes() {
    this.cellWidth = (this.canvas.width - this.innerBorderWidth*this.columnsAm)/this.columnsAm;
    this.cellHeight = (this.canvas.height - this.innerBorderWidth*this.rowsAm)/this.rowsAm;
  }
  initCells () {
    this.cells = [];
    for(let x=0; x<this.columnsAm; x++) {
      this.cells[x] = [];

      for(let y =0; y<this.rowsAm; y++) {
        this.cells[x][y] = {
          color: this.backgroundColor,
          isEmpty: true
        }
      }
    }

  }

  render() {
    this.cells.forEach((column, x) => {
      column.forEach((cell, y) => {
        this.renderCell(x, y, cell.color);
      })
    })
  }

  renderFigure() {
    this.figure.cells.forEach(cell => {
      this.occupyCell(cell.x, cell.y, this.figure.color);
    })
  }


  renderCell(c,r,color) {
  //  console.log(`rendering cell ${c} ${r} ${color}`);
    let res = this.convertCoord(c, r);
    let x = res.x;
    let y = res.y;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, this.cellWidth, this.cellHeight);
  }

  occupyCell (x, y, color = 'grey') {
    //console.log(`occyping cell ${x} ${y} ${color}`);
    this.renderCell(x, y, color);
    if (x<this.columnsAm && y<this.rowsAm && this.cells[x][y]) {
      this.cells[x][y].isEmpty = false;
      this.cells[x][y].color = color;
    }
  }

  clearCell (x, y) {
  let res = this.convertCoord(x, y);
    let c = res.x;
    let r = res.y;
    this.ctx.clearRect(c, r, this.cellWidth, this.cellHeight)
    this.renderCell(x, y, this.backgroundColor);
    if (this.cells[x][y]) {
      this.cells[x][y].isEmpty = true;
      this.cells[x][y].color = this.backgroundColor}
  }

  moveCell(x,y, newX, newY) {
    this.occupyCell(newX, newY, this.cells[x][y].color);
    this.clearCell(x, y);
    
   
  }

  convertCoord (c, r) {
      return {
        x: (this.cellWidth + this.innerBorderWidth)*c,
        y: (this.cellHeight + this.innerBorderWidth)*r
      }
  }

  newFigure(figure, coord) {
    this.figure = figure;
    this.figure.cells.forEach(cell => {
      cell.x = coord.x + cell.x; //запись в координаты фигуры координат поля
      cell.y = coord.y + cell.y;
      if(!!this.cells[cell.x][cell.y] && !this.cells[cell.x][cell.y].isEmpty) {
        this.gameOver = true;
      } else this.occupyCell(cell.x, cell.y, figure.color);
    })
 //   console.log(`figure ${this.figure.type} added to the field, cells ${JSON.stringify(this.figure.cells)}`)
  }

  getFigureRealCoords() {
    let xMin = this.columnsAm - 1;
    let xMax = 0;
    let yMin = this.rowsAm - 1;
    let yMax = 0;

    this.figure.cells.forEach(cell => {
      xMin = xMin > cell.x ? cell.x : xMin;
      xMax = xMax < cell.x ? cell.x : xMax;
      yMin = yMin > cell.y ? cell.y : yMin;
      yMax = yMax < cell.y ? cell.y : yMax;
    })

    let min = this.convertCoord(xMin, yMin);
    let max = this.convertCoord(xMax, yMax);

    return {min, max};
  }

  positionsDiff(oldCells, newCells) {
    let cellsToRemove = [];
    let cellsToAdd = []
    let match;

    oldCells.forEach(oldCell => {
      match = false;
      newCells.forEach(newCell => {
        if(newCell.x === oldCell.x && newCell.y === oldCell.y) {
          match = true;
        }
      });
      if(!match) {
        cellsToRemove.push({x: oldCell.x, y: oldCell.y});
      }
    })
    

    newCells.forEach(newCell => {
      match = false;
      oldCells.forEach(oldCell => {
        if(newCell.x === oldCell.x && newCell.y === oldCell.y) {
          match = true;
        }
      });
      if(!match) {
        cellsToAdd.push({x: newCell.x, y: newCell.y});
      }
    })
    return {
      cellsToRemove: cellsToRemove,
      cellsToAdd: cellsToAdd
    }
  }

  moveFigure(direction) {
    if(this.game.isRunning) {
      let newPosition = this.figure.getNewPosition(direction);
      
      if(field.checkCollide(newPosition)) {
        if(direction === 'rotate') {
          this.figure.vector = this.figure.getNewVector();
        }


        let posDiff = this.positionsDiff(this.figure.cells, newPosition);

        posDiff.cellsToRemove.forEach(cell => {
          this.clearCell(cell.x, cell.y);
        });

        posDiff.cellsToAdd.forEach(cell => {
          this.occupyCell(cell.x, cell.y, this.figure.color);
        })

        this.figure.cells.forEach((cell, i) => {
          cell.x = newPosition[i].x;
          cell.y = newPosition[i].y;
        })
      }
    }
}

dropFigure() {
  if(this.game.isRunning) {
    let color = this.figure.color
    this.figure.color = this.backgroundColor;

    let newPosition = this.figure.getNewPosition('down');
    while (field.checkCollide(newPosition)) {
      field.moveFigure('down');
      newPosition = this.figure.getNewPosition('down');
    };
    this.figure.color = color;
    this.renderFigure();
  }
}

isFigureFin() {
  let downPos = this.figure.getNewPosition('down');
  return !this.checkCollide(downPos);
}


  checkCollide(newPosition, cells = this.figure.cells) {
    let cellsToCheck = this.positionsDiff(cells, newPosition).cellsToAdd;
    this.figure.cells.forEach(cell => {
    })
    cellsToCheck.forEach(cell => {
    })
    let result = true;

    cellsToCheck.forEach(cell => {
      let moreThanCol = cell.x >= this.columnsAm;
      let moreThanRow = cell.y >= this.rowsAm;
      let belowCol = cell.x < 0;
      let outOfBorders = moreThanCol || moreThanRow || belowCol;
      let isEmptyCell = true;
      if (!outOfBorders && this.cells[cell.x][cell.y]) {
        isEmptyCell = this.cells[cell.x][cell.y].isEmpty;
      }
      else if(cell.y < 0) isEmptyCell = true;
      if(outOfBorders || !isEmptyCell) {
        result = false;
      }
      
    });
    return result;
  }

getRowCells(row) {
  let cells = [];
  for(let column = 0; column < this.columnsAm; column++) {
    cells.push(this.cells[column][row]);
  }
  return cells;
}

isEmptyRow(row) {
  console.log(`checking if ${row}th row is empty`);
  for(let i = 0; i < this.columnsAm; i++) {
    if (!this.cells[i][row].isEmpty) {
      console.log('not empty')
      return false;
    }
  }
  return true;
}

getWholeRows() {
 
  let rows = [];
  for (let row = 0; row < this.rowsAm; row++) {
    let result = true;
    for (let column = 0; column < this.columnsAm; column++) {
      result = result && !this.cells[column][row].isEmpty;
    }
    if (result) rows.push(row);
  }

  return rows;
}

dropUpperRows(rows) {
  console.log(`dropping ${rows.length} rows`);
  rows.forEach((row) => {
    console.log(`dropping rows above ${row}`);
    for(let j = row - 1; j >= 0; j--) {
      console.log(`dropping row ${j}`);
      for(let k = 0; k < this.columnsAm; k++) {
        if(!this.cells[k][j].isEmpty) this.moveCell(k, j, k, j + 1);
        console.log(`moving cell ${k} ${j}`);
      }
    }
  })
  console.log(`rows dropped ${this.getWholeRows()}`);
}





deleteRows() {

  let rows = this.getWholeRows();
 
 console.log(`deleting ${JSON.stringify(rows)}`);
  
  if(rows.length !== 0) {
    rows.forEach(row => {
      for(let i=0; i < this.columnsAm; i++) {
        this.clearCell(i, row);
      }
    });
    this.dropUpperRows(rows);
    }

}
makeGrid(gridWidth, color) {
  this.innerBorderWidth = gridWidth;
  this.ctx.fillStyle = color;
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  this.updateSizes();
  this.initCells();
  this.render();
}

}



class BackField extends Field {
  constructor(canvas) {
    super(canvas);
    this.innerBorderWidth = 0;
    this.backgroundColor = 'white';
  }

  findVacantCell() {
    let cell = {};
    for(let x=0; x<this.columnsAm; x++) {
     

      for(let y =0; y<this.rowsAm; y++) {
        if(this.cells[x][y].isEmpty) {
          cell.x = x;
          cell.y = y;
          return cell;
        } 
      }
    }
  }
  addCells(cells) {
    let startCell = this.findVacantCell();
    if(startCell) {
      cells.forEach((cell, i) => {
        let newColor;
        switch (cell.color) {
          case 'DarkRed':
             newColor = '#150000';
             break;
          case 'DarkGreen':
             newColor = '#001500';
             break;
          case 'DarkBlue':
             newColor = '#000015';
             break;
        }
        this.occupyCell(startCell.x+i, startCell.y, newColor);
      })
    }
  }
}