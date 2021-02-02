const gameCanvas = document.getElementById('tetris');
const nextFigureCanvas = document.getElementById('nextFigure');
const backCanvas = document.getElementById('backGround');
const nextFigureElem = document.querySelector('.scoreBoard__nextFigure');
const scoreElem = document.querySelector('.scoreBoard__score');
const pauseBannerElem = document.querySelector('.pause-banner');
const pauseBannerText = pauseBannerElem.querySelector('.pause-banner__text');

function resizeCanvas(canvas, canvasObj) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasObj.render();
}

function scoreBoardCoordsForFigure(figure) {
  let nextFigureCoords = {};
  switch(figure.type) {
    case 'I':
      nextFigureCoords = {x: 1, y: 1};
      break;
    case 'J':
    case 'T':
    case 'Z':
      nextFigureCoords = {x: 1, y: 1};
      break;
    case 'L':
    case 'S':
      nextFigureCoords = {x: 1, y: 1};
      break;
    case 'O':
      nextFigureCoords = {x: 2, y: 1};
      break;
  }
  return nextFigureCoords;
}

function resetGame(tick, flowFunc) {
    this.pauseBanner.newGame();
    this.tick = tick;
    this.flowFunc = flowFunc;
    field.gameOver = false;
    field.initCells();
    field.render();
    field.newFigure(new Figure(), {x: 5, y: 0});
    nextFigure = new Figure() // код повторяется
    nextFigure.setHorizontal();
    nextFigureField.initCells();
    nextFigureField.newFigure(nextFigure, scoreBoardCoordsForFigure(nextFigure));
    nextFigureField.render();
    backField.initCells();
    backField.render();
    game.score = 0;
}





function transferRows(field, backField) {
  let rowsToDelete = field.getWholeRows();
  if(rowsToDelete.length) {
    rowsToDelete.forEach(row => {
      let cells = field.getRowCells(row);
      backField.addCells(cells);
    })
  }
}

let pauseBanner = new PauseBanner(pauseBannerElem, pauseBannerText);
let game = new Game(scoreElem, pauseBanner);
game.onReset(resetGame);
field = new Field(gameCanvas);
field.newFigure(new Figure(), {x: 5, y: 0});

nextFigureField = new Field(nextFigureCanvas, 2, 4);
backField = new BackField(backCanvas);

backField.rowsAm = 40; // костыль, нужно причесать класс field и его потомков 
BackField.innerBorderWidth = 0;
backField.columnsAm = 30;
backField.cellWidth = field.cellWidth;
backField.cellHeight = field.cellHeight;
backField.backgroundColor = 'white';
backField.initCells();
backField.render();

let  nextFigure = new Figure()
nextFigureField.newFigure(nextFigure, scoreBoardCoordsForFigure(nextFigure));
nextFigureField.render();


const flowFunc = function() {
  field.moveFigure('down');
/*  for(let i = 0; i < field.columnsAm; i++) {
    field.renderCell(i, 1, 'black');
  } */
  if (field.isFigureFin()) {

    let wholeRows = field.getWholeRows();
    if (wholeRows.length === 0) {
      game.score += 10;
    } else game.score +=100;
    
    transferRows(field, backField);
    console.log(`transfered rows`);
    field.deleteRows();
    field.newFigure(new Figure(nextFigure.type, nextFigure.color), {x: 5, y: 0});
    nextFigure = new Figure();
    nextFigureField.initCells();
    nextFigureField.newFigure(nextFigure, scoreBoardCoordsForFigure(nextFigure));
    nextFigureField.render();
 

    if(field.gameOver) {
      game.gameOver();
    }
  }
  
}





game.reset(1250, flowFunc);


window.addEventListener('keydown', function(event) {
  let action;
  if(game.isRunning) {

    switch(event.key) {
      case 'ArrowDown':
        action = 'down'
        break;
      case 'ArrowLeft':
        action = 'left';
        break;
      case 'ArrowRight':
        action = 'right';
        break;
      case 'ArrowUp':
        action = 'rotate';
        break;
      case ' ':
        action = 'drop';
        break;
    }
  }

  if(event.key === 'Enter') {
      if(game.isRunning) {
        game.pause();
      } else {
        if(field.gameOver)  {
          game.reset(1250, flowFunc);
        }
        game.start();
      } 
    }


  if(action === 'drop') {
    event.preventDefault();
    field.dropFigure();
    game.flowFunc();
    if(game.isRunning) {
      game.pause();
      game.start();
    }
  } else {
    if(action)  event.preventDefault();
    field.moveFigure(action);
  
}
})


/*
 Сделать:
  - нормальный сброс игры при геймовере ***done***
  - ускорение игры
  - нормальный зачет очков
 Ошибки:
  - перед отображением геймовера новая фигура не должна появляться
  - когда убирается несколько рядов - внизу остается белый ряд
  - отступ поля сверху постоянен при изменении размеров окна
  - логику геймовера надо переписать (и посмотреть как в настоящем тетрисе появляется новая фигура)
  */