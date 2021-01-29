

class Field {
  constructor(canvas, rowsAm = 20, columnsAm = 10) {
    this.rowsAm = rowsAm;
    this.columnsAm = columnsAm;
    this.canvas = canvas;
    this.innerBorderWidth = 0;
    this.backgroundColor = 'white';
 //   this.texture = texture;
    this.cellWidth = (this.canvas.width - this.innerBorderWidth*this.columnsAm)/this.columnsAm;
    this.cellHeight = (this.canvas.height - this.innerBorderWidth*this.rowsAm)/this.rowsAm;
    
    this.initCells()
    this.ctx = canvas.getContext('2d');
    this.gameOver = false;
    this.render();
  }

  updateSizes() {
    console.log(`updating sizes`);
    this.cellWidth = (this.canvas.width - this.innerBorderWidth*this.columnsAm)/this.columnsAm;
    this.cellHeight = (this.canvas.height - this.innerBorderWidth*this.rowsAm)/this.rowsAm;
  }
  initCells () {
 //  console.log(`initializing cells ${this.backgroundColor}\n\n\n`);
    this.cells = [];
    for(let x=0; x<this.columnsAm; x++) {
      this.cells[x] = [];

      for(let y =0; y<this.rowsAm; y++) {
        this.cells[x][y] = {
          color: this.backgroundColor,
          isEmpty: true
        }
   //     console.log(`cell ${x} ${y} ${this.cells[x][y].color} ${this.cells[x][y].isEmpty}`);
      }
    }

  }

  render() {
  //  console.log(`rendering canvas, cell: ${this.cellWidth}, ${this.cellHeight}, rows: ${this.rowsAm}`);
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
    let res = this.convertCoord(c, r);
    let x = res.x;
    let y = res.y;
 //   console.log(`rendering cell at ${x}, ${y}, width: ${this.cellWidth}, height: ${this.cellHeight}`);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, this.cellWidth, this.cellHeight);
  //  if(color !== this.backgroundColor) this.ctx.drawImage(this.texture, x, y, this.cellHeight, this.cellHeight);
  }

  occupyCell (x, y, color = 'grey') {
  //  console.log(`occyping cell ${x} ${y} ${color}`);
    this.renderCell(x, y, color);
    if (x<this.columnsAm && y<this.rowsAm && this.cells[x][y]) {
      this.cells[x][y].isEmpty = false;
      this.cells[x][y].color = color;
    }
  }

  clearCell (x, y) {
  //  console.log(`clearing cell ${x}, ${y}`);
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
  //  console.log(`moving cell to ${newX}, ${newY}`)
    this.occupyCell(newX, newY, this.cells[x][y].color);
    this.clearCell(x, y);
   // console.log(`moved cell ${this.cells[newX][newY].isEmpty}, ${this.cells[newX][newY].color}`)
    
   
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
 //     console.log(`rendering new figure cell ${cell.x} ${cell.y}`);
      if(!!this.cells[cell.x][cell.y] && cell.y >= 0 && !this.cells[cell.x][cell.y].isEmpty) {
        console.log('new figure collision!');
        this.gameOver = true;
      }
      this.occupyCell(cell.x, cell.y, figure.color);
    })
  //  console.log(`new Figure set, position: ${this.figure.cells[0].x}, ${this.figure.cells[0].y}`)
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
  console.log(`figure move ${direction}`);
    let newPosition = this.figure.getNewPosition(direction);
    
    if(field.checkCollide(newPosition)) {
  


  /*  console.log(`moving figure`);
    this.figure.cells.forEach(cell => {
      console.log(`${cell.x}, ${cell.y}`);
    })
    console.log(`new position:`)
    newPosition.forEach(cell => {
      console.log(`${cell.x}, ${cell.y}`);
    })
  */
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

dropFigure() {
 // console.log(`dropping figure`);
  let color = this.figure.color
  this.figure.color = this.backgroundColor;

  let newPosition = this.figure.getNewPosition('down');
  while (field.checkCollide(newPosition)) {
    field.moveFigure('down');
    newPosition = this.figure.getNewPosition('down');
  };
  this.figure.color = color;
  this.renderFigure();
//  console.log(`dropped figure`);
}

isFigureFin() {
 // console.log(`checking if figure is done`);
  let downPos = this.figure.getNewPosition('down');
  return !this.checkCollide(downPos);
}


  checkCollide(newPosition, cells = this.figure.cells) {
    let cellsToCheck = this.positionsDiff(cells, newPosition).cellsToAdd;
 //   console.log(`checking collide`);

 //   console.log(`moving figure`);
    this.figure.cells.forEach(cell => {
  //    console.log(`${cell.x}, ${cell.y}`);
    })
 //   console.log(`new cells:`)
    cellsToCheck.forEach(cell => {
 //     console.log(`${cell.x}, ${cell.y}`);
    })
    let result = true;

    cellsToCheck.forEach(cell => {
   //   console.log(`checking new cell ${cell.x}, ${cell.y}`)
      let moreThanCol = cell.x >= this.columnsAm;
      let moreThanRow = cell.y >= this.rowsAm;
      let belowCol = cell.x < 0;
      let outOfBorders = moreThanCol || moreThanRow || belowCol;
      let isEmptyCell = true;
      if (!outOfBorders && this.cells[cell.x][cell.y]) {
  //      console.log(`something with empty cell check ${this.cells[cell.x][cell.y].isEmpty}`);
        isEmptyCell = this.cells[cell.x][cell.y].isEmpty;
      }
      else if(cell.y < 0) isEmptyCell = true;
      if(outOfBorders || !isEmptyCell) {
  //      console.log(`collide! ${!isEmptyCell}, ${outOfBorders}`);
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

dropUpperRows(row, k) {
 // console.log(`dropping rows from ${row - 1} ${k}`)
  let isEmptyRow = false;
  
  let j = 1;
  while(!isEmptyRow && j < this.rowsAm) {
    isEmptyRow = true;
    for(let i = 0; i < this.columnsAm; i++) {
        if(!this.cells[i][row - j].isEmpty) {
 //         console.log(`occupied cell ${i}, ${row-j}`);
          isEmptyRow = false;
          this.moveCell(i, row - j, i, row-j+k);
      }
    }
 //   console.log(`\n\n\n`);
    j++;
  }
 
}

deleteRows() {

  let rows = this.getWholeRows();
  
 
  
  
  if(rows.length !== 0) {
    rows.forEach(row => {
      for(let i=0; i < this.columnsAm; i++) {
       
        this.clearCell(i, row);
      }
    });
  //  console.log(`min row: ${Math.min(rows)}`);
    this.dropUpperRows(Math.min(...rows), rows.length);
    }
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