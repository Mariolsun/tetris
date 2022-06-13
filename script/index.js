const gameCanvas = document.getElementById('tetris');
const nextFigureCanvas = document.getElementById('nextFigure');
const backCanvas = document.getElementById('backGround');
const nextFigureElem = document.querySelector('.scoreBoard__nextFigure');
const scoreBoardElem = document.querySelector('.scoreBoard');
const scoreElem = document.querySelector('.scoreBoard__score');
const pauseBannerElem = document.querySelector('.pause-banner');
const pauseBannerText = pauseBannerElem.querySelector('.pause-banner__text');
const mobileBtnLeft = document.querySelector('.mobile-buttons__button_type_left')
const mobileBtnUp = document.querySelector('.mobile-buttons__button_type_up');
const mobileBtnDown = document.querySelector('.mobile-buttons__button_type_down');
const mobileBtnRight = document.querySelector('.mobile-buttons__button_type_right');
const mobileBtnDrop = document.querySelector('.mobile-buttons__button_type_drop');
const mobileBtnPause = document.querySelector('.mobile-buttons__button_type_pause');
const mobileBtnsElem = document.querySelector('.mobile-buttons');

/*function resizeCanvas(canvas, canvasObj) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasObj.render();
} */

function scoreBoardCoordsForFigure(figure) {
  let nextFigureCoords = {};
  switch(figure.type) {
    case 'I':
      nextFigureCoords = {x: 1, y: 2};
      break;
    case 'J':
    case 'T':
    case 'Z':
      nextFigureCoords = {x: 1, y: 2};
      break;
    case 'L':
    case 'S':
      nextFigureCoords = {x: 1, y: 2};
      break;
    case 'O':
      nextFigureCoords = {x: 2, y: 2};
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
field = new Field(gameCanvas, game);
field.makeGrid(1,'rgb(220,220,220');
field.newFigure(new Figure(), {x: 5, y: 0});
nextFigureField = new Field(nextFigureCanvas, {}, 4, 4);
//nextFigureField.ctx.canvas.style.width = '50px';
//nextFigureField.ctx.canvas.style.height = '50px';
nextFigureField.ct
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
nextFigure.rotate(2);
nextFigureField.newFigure(nextFigure, scoreBoardCoordsForFigure(nextFigure));
nextFigureField.render();


const flowFunc = function() {
  if(field.gameOver) {
    game.gameOver();
  }

  if (field.isFigureFin()) {

    let wholeRows = field.getWholeRows();
    if (wholeRows.length === 0) {
      game.score += 10;
    } else game.score +=100;
    
    transferRows(field, backField);
    console.log(`transfered rows`);
    field.deleteRows();
    field.newFigure(new Figure(nextFigure.type, nextFigure.color), {x: 5, y: 0});
    if(field.gameOver) {
      game.gameOver();
    }
    nextFigure = new Figure();
    nextFigureField.initCells();
    nextFigureField.newFigure(nextFigure, scoreBoardCoordsForFigure(nextFigure));
    nextFigureField.render();
 
  }
  
  field.moveFigure('down');
}





game.reset(1250, flowFunc);


if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  pauseBannerElem.style.display = 'none';
  mobileBtnDown.addEventListener('touchstart', function(event) {
    event.preventDefault();
    field.moveFigure('down');
  })
  mobileBtnUp.addEventListener('touchend', function(event) {
    event.preventDefault();
    field.moveFigure('rotate');
  })
  mobileBtnLeft.addEventListener('touchend', function(event) {
    event.preventDefault();
    field.moveFigure('left');
  })
  mobileBtnRight.addEventListener('touchend', function(event) {
    event.preventDefault();
    field.moveFigure('right');
  })
  mobileBtnDrop.addEventListener('touchend', function(event) {
    event.preventDefault();
      field.dropFigure();
      game.flowFunc();
  })
  mobileBtnPause.addEventListener('touchend', function(event) {
    if(game.isRunning) {
      game.pause();
      console.log('pausing game on mobile');
    } else {
      if(field.gameOver)  {
        console.log('resetting game on mobile');
        game.reset(1250, flowFunc);
      }
      game.start();
      console.log('started game on mobile');
    }
  })
} else {
  mobileBtnsElem.style.display = 'none';
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
}

if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) { 
  /* iOS hides Safari address bar */
  window.addEventListener("load",function() {
      setTimeout(function() {
          window.scrollTo(0, 1);
      }, 1000);
  });
}


/*
 Сделать:
 - скрытие/показ элементов путем классов css
 Ошибки:
 */