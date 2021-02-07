const gameCanvas = document.getElementById('tetris');
const nextFigureCanvas = document.getElementById('nextFigure');
const backCanvas = document.getElementById('backGround');
const nextFigureElem = document.querySelector('.scoreBoard__nextFigure');
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

(function init100vh(){
  function setHeight() {
    var vh = window.screen.height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setHeight();
  window.addEventListener('resize', setHeight);
})();



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
  if(field.gameOver) {
    game.gameOver();
  }
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
    if(field.gameOver) {
      game.gameOver();
    }
    nextFigure = new Figure();
    nextFigureField.initCells();
    nextFigureField.newFigure(nextFigure, scoreBoardCoordsForFigure(nextFigure));
    nextFigureField.render();
 
  }
  
  field.moveFigure('down');
 // game.updateTick();
}





game.reset(1250, flowFunc);


/*function mobileGameTouchhandler(event) {
    event.preventDefault();
    let figureCoords = field.getFigureRealCoords();
    let action;
    let canvasRect = gameCanvas.getBoundingClientRect();
    let left = event.touches[0].pageX - canvasRect.left;
    let top = event.touches[0].pageY - canvasRect.top;
    console.log(JSON.stringify(figureCoords));
    console.log(`x ${left} y ${top}`);
    if(figureCoords.min.x - 50 < left && left < figureCoords.max.x + 50 && figureCoords.min.y - 50 < top && top < figureCoords.max.y + 50) {
      action = 'rotate';
    } else if(figureCoords.max.y  + 20 < top) {
      console.log('down');
      action = 'down';
    } else if(figureCoords.min.x > left) {
      action = 'left';
    } else if(figureCoords.max.x < left) {
      action = 'right';
    }
    console.log(`event fired action: ${action}`);
    field.moveFigure(action);
}

function mobileGameStartEvent () {
 // game.start()
  window.removeEventListener('touchend', mobileGameStartEvent);
  gameCanvas.addEventListener('touchend', mobileGameTouchhandler)
} */

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




/*
 Сделать:
 - скрытие/показ элементов путем классов css
 Ошибки:
 */