const gameCanvas = document.getElementById('tetris');
//ctx = gameCanvas.getContext('2d');
//let texture = new Image();
//texture.src = './textures/texture.jpg';
const nextFigureCanvas = document.getElementById('nextFigure');
const backCanvas = document.getElementById('backGround');
const nextFigureElem = document.querySelector('.scoreBoard__nextFigure');
const scoreElem = document.querySelector('.scoreBoard__score');
const pauseBannerElem = document.querySelector('.pause-banner');

function resizeCanvas(canvas, canvasObj) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasObj.render();
  console.log(`resized canvas`);
}


figure = new Figure();



/*
resizeCanvas(backCanvas, backField);
window.addEventListener('resize', () => {
  resizeCanvas(backCanvas, backField);
}) 
*/


function transferRows(field, backField) {
  let rowsToDelete = field.getWholeRows();
  if(rowsToDelete.length) {
    rowsToDelete.forEach(row => {
      let cells = field.getRowCells(row);
      backField.addCells(cells);
    })
  }
}

let game = new Game(scoreElem, nextFigureElem, pauseBannerElem);
field = new Field(gameCanvas);

field.newFigure(figure, {x: 5, y: 0});

nextFigureField = new Field(nextFigureCanvas, 3, 5);
backField = new BackField(backCanvas);

backField.rowsAm = 40; // костыль, нужно причесать класс field и его потомков 
BackField.innerBorderWidth = 0;
backField.columnsAm = 30;
backField.cellWidth = field.cellWidth;
backField.cellHeight = field.cellHeight;
backField.backgroundColor = 'white';
backField.initCells();
backField.render();

const flowFunc = function() {
  console.log(`in flow function, interval: ${game.tick}`);
  if (field.isFigureFin()) {

    let wholeRows = field.getWholeRows();
    if (wholeRows.length === 0) {
      game.score += 10;
    } else game.score +=100;
    
    transferRows(field, backField);
    field.deleteRows();
    nextFigureField.initCells();
    
    nextFigureField.newFigure(new Figure('I'), {x: 2, y: 0});
    nextFigureField.moveFigure('rotate');
    nextFigureField.render();
    field.newFigure(new Figure(), {x: 5, y: 0});
 

    if(field.gameOver) {
      console.log('game over!');
      game.pause();
   //   gameFlow.isRunning = false;
    }
  }
  
  field.moveFigure('down');
}
let test = 2;

game.set(1000, flowFunc);


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
      } else  {
        game.start();
      }
    }

  console.log(`keydown, test variable: ${test}`)

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
   // console.log(event.key);
    field.moveFigure(action);
  
}
})


console.log(`end of index.js`)

/*
 Сделать:
  - отрисовку следующей фигуры
  - отрисовку надписи game over
  - нормальный сброс игры при геймовере
 Ошибки:
  - когда убирается несколько рядов - внизу остается белый ряд (проблема именно с самым нижним рядом);
  - отступ поля сверху постоянен при изменении размеров окна
  */