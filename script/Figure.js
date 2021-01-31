class Figure  {
  constructor(type, color) {
    this.type = !!type? type : this.getRandomFigure();
    this.setFigure(this.type);
    this.color = !!color? color : this.getRandomColor();
    this.vector = 0;
    this.setHorizontal();

  }

  setFigure(type) {
    switch(type) { //Относительные координаты клеток фигуры, первая клетка - ось вращения
      case 'T': 
        this.cells =  [
          {x:  0, y:  0},
          {x:  0, y: -1},
          {x:  1, y:  0},
          {x: -1, y:  0},
        ];
        break;
      case 'I':
        this.cells =  [
          {x:  0, y:  0},
          {x:  0, y:  1},
          {x:  0, y: -1},
          {x:  0, y:  2},
        ];
        break;
      case 'J':
        this.cells =  [
          {x:  0, y:  0},
          {x: -1, y:  1},
          {x:  0, y: -1},
          {x:  0, y:  1},
        ];
        break;
      case 'L':
        this.cells =  [
          {x:  0, y:  0},
          {x:  1, y:  1},
          {x:  0, y: -1},
          {x:  0, y:  1},
        ];
        break;
       case 'O':
        this.cells =  [
          {x:  0, y:  0},
          {x:  0, y: -1},
          {x: -1, y:  0},
          {x: -1, y: -1},
        ];
        break;
       case 'S':
        this.cells =  [
          {x:  0, y:  0},
          {x:  0, y: -1},
          {x: -1, y:  0},
          {x:  1, y: -1},
        ];
        break;
       case 'Z':
        this.cells =  [
          {x:  0, y:  0},
          {x:  0, y: -1},
          {x: -1, y: -1},
          {x:  1, y:  0},
        ];
        break;
      
    }
   
  }

  getRandomColor() {
    let result;
      switch(Math.floor(Math.random() * Math.floor(3))) {
        case 0:
          result = 'DarkGreen';
          break;
        case 1: 
          result = 'DarkRed';
          break;
        case 2:
          result = 'DarkBlue';
          break;
      }
    return result;
  }


  getRandomFigure() {
    let result;
      switch(Math.floor(Math.random() * Math.floor(7))) {
        case 0:
          result = 'T';
          break;
        case 1: 
          result = 'J';
          break;
        case 2:
          result = 'L';
          break;
        case 3:
          result = 'O';
          break;
        case 4: 
          result = 'S';
          break;
        case 5:
          result = 'Z';
          break;
        case 6:
          result = 'I';
          break;
      }
      
    return result;

  }

  getNewPosition(direction) {
    let diff = {x: 0, y: 0};
      switch (direction) {
        case 'down':
        case 'drop':
          diff.y = 1;
          break;
        case 'up':
          diff.y = -1;
          break;
        case 'left':
          diff.x = -1;
          break;
        case 'right':
          diff.x = 1;
          break;      
      }
  let newCells = [];
  if (direction === 'rotate') {
    let rotateCells = this.rotate();
    
    rotateCells.forEach((cell, i) => {
      newCells[i] = {
        x: cell.x,
        y: cell.y
      }
    })
  }    
  else {
    this.cells.forEach((cell, i) => {
    
      newCells[i] = {
        x: cell.x + diff.x,
        y: cell.y + diff.y
          }
      
    });
  }

  return newCells;
}




  rotate(times = 1) {
    let iterations = times > 0 && times < 5 ? times : 1;
    let firstCell = this.cells[0];
    let newCells = [];

  for(let x = 0; x < iterations; x++) {
      if (this.type === 'O') {
        return [
          {x: firstCell.x    , y: firstCell.y    },
          {x: firstCell.x    , y: firstCell.y - 1},
          {x: firstCell.x - 1, y: firstCell.y    },
          {x: firstCell.x - 1, y: firstCell.y - 1},
        ];
      }


      let newVector = this.getNewVector();
      switch(this.type) {
        case 'T':
          switch(newVector) {
            case 0:
            
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y - 1},
                {x: firstCell.x + 1, y: firstCell.y    },
                {x: firstCell.x - 1, y: firstCell.y    },
              );
            break;
            case 1:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y - 1},
                {x: firstCell.x    , y: firstCell.y + 1},
                {x: firstCell.x - 1, y: firstCell.y    },
              );
            break;
            case 2:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y + 1},
                {x: firstCell.x + 1, y: firstCell.y    },
                {x: firstCell.x - 1, y: firstCell.y    },
              );
            break;
            case 3:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y - 1},
                {x: firstCell.x + 1, y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y + 1},
              );
            break;
          }
        break;
        
        case 'I':
          switch(newVector) {
            case 0:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y + 1},
                {x: firstCell.x    , y: firstCell.y - 1},
                {x: firstCell.x    , y: firstCell.y + 2},
              );
            break;
            case 1:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x + 1, y: firstCell.y    },
                {x: firstCell.x + 2, y: firstCell.y    },
                {x: firstCell.x - 1, y: firstCell.y    },
              );
            break;
            case 2:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y + 1},
                {x: firstCell.x    , y: firstCell.y - 1},
                {x: firstCell.x    , y: firstCell.y - 2},
              );
            break;
            case 3:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x + 1, y: firstCell.y    },
                {x: firstCell.x - 1, y: firstCell.y    },
                {x: firstCell.x - 2, y: firstCell.y    },
              );
            break;
          }
        break;
        case 'J':
          switch(newVector) {
            case 0:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x - 1, y: firstCell.y + 1},
                {x: firstCell.x    , y: firstCell.y + 1},
                {x: firstCell.x    , y: firstCell.y - 1},
              );
            break;
            case 1:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x - 1, y: firstCell.y    },
                {x: firstCell.x + 1, y: firstCell.y    },
                {x: firstCell.x + 1, y: firstCell.y + 1},
              );
            break;
            case 2:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y + 1},
                {x: firstCell.x    , y: firstCell.y - 1},
                {x: firstCell.x + 1, y: firstCell.y - 1},
              );
            break;
            case 3:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x - 1, y: firstCell.y    },
                {x: firstCell.x - 1, y: firstCell.y - 1},
                {x: firstCell.x + 1, y: firstCell.y    },
              );
            break;
          }
        break;
        case 'L':
          switch(newVector) {
            case 0:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x + 1, y: firstCell.y + 1},
                {x: firstCell.x    , y: firstCell.y - 1},
                {x: firstCell.x    , y: firstCell.y + 1},
              );
            break;
            case 1:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x + 1, y: firstCell.y    },
                {x: firstCell.x + 1, y: firstCell.y - 1},
                {x: firstCell.x - 1, y: firstCell.y    },
              );
            break;
            case 2:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y + 1},
                {x: firstCell.x    , y: firstCell.y - 1},
                {x: firstCell.x - 1, y: firstCell.y - 1},
              );
            break;
            case 3:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x + 1, y: firstCell.y    },
                {x: firstCell.x - 1, y: firstCell.y    },
                {x: firstCell.x - 1, y: firstCell.y + 1},
              );
            break;
          }
        break;
        case 'S':
          switch(newVector) {
            case 0:
            case 2:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y - 1},
                {x: firstCell.x - 1, y: firstCell.y    },
                {x: firstCell.x + 1, y: firstCell.y - 1},
              );
            break;
            case 1:
            case 3:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y - 1},
                {x: firstCell.x + 1, y: firstCell.y + 1},
                {x: firstCell.x + 1, y: firstCell.y    },
              );
            break;
          }
        break;
        case 'Z':
          switch(newVector) {
            case 0:
            case 2:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y - 1},
                {x: firstCell.x - 1, y: firstCell.y - 1},
                {x: firstCell.x + 1, y: firstCell.y    },
              );
            break;
            case 1:
            case 3:
              newCells.push(
                {x: firstCell.x    , y: firstCell.y    },
                {x: firstCell.x - 1, y: firstCell.y    },
                {x: firstCell.x    , y: firstCell.y - 1},
                {x: firstCell.x - 1, y: firstCell.y + 1},
              );
            break;
          }
        break;
      }
    }

    return newCells;
  }

  getNewVector() {
    return this.vector === 3 ? 0 : this.vector + 1;
  }

  getNewFigure(type, vector) {
    return new Figure(type, vector);
  }

  setHorizontal() {
    let toVector = 0;
    switch(this.type) {
      case 'I':
      case 'L':
        toVector = 1;
        break;
      case 'J':
        toVector = 3;
        break;
    }
    
    while(toVector != this.vector) {
      this.cells = this.rotate();
      this.vector = this.getNewVector();
    }
  }
}

