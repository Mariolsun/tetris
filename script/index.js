const gameCanvas = document.getElementById('tetris');
//ctx = gameCanvas.getContext('2d');
//let texture = new Image();
//texture.src = './textures/texture.jpg';

const backCanvas = document.getElementById('backGround');
const nextFigureElem = document.querySelector('.scoreBoard__nextFigure');
const scoreElem = document.querySelector('.scoreBoard__score');
function resizeCanvas(canvas, canvasObj) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasObj.render();
}


figure = new Figure();

backField = new BackField(backCanvas);

backField.rowsAm = 40;
backField.columnsAm = 30;
backField.updateSizes();
backField.backgroundColor = 'gray';
backField.initCells();
backField.render();

/*
resizeCanvas(backCanvas, backField);
window.addEventListener('resize', () => {
  resizeCanvas(backCanvas, backField);
}) 
*/

function doScore() {

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
let game = new Game(scoreElem, nextFigureElem);
field = new Field(gameCanvas);

field.newFigure(figure, {x: 5, y: 0});

const flowFunc = function() {
  console.log(`in flow function, interval: ${gameFlow}`);
  if (field.isFigureFin()) {

    let wholeRows = field.getWholeRows();
    if (wholeRows.length === 0) {
      game.score += 10;
    } else game.score +=100;
    let gameOver = field.isGameOver()
 

    if(!gameOver) {
      field.newFigure(new Figure(), {x: 5, y: 0});
      transferRows(field, backField);
      field.deleteRows();
    } else {
      console.log('game over!');
      clearInterval(gameFlow);
    }
  }
  
  field.moveFigure('down');
console.log(`end of flow function, interval: ${gameFlow}`);
}
let test = 2;

let gameFlow = setInterval(flowFunc, 1000);
console.log(`gameFlow created ${gameFlow}`);


window.addEventListener('keydown', function(event) {
  if(gameFlow) {
  let action;
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
    case 'Enter':
      clearInterval(gameFlow);
      break;
  }  
  console.log(`keydown, test variable: ${test}`)

  if(action === 'drop') {
    console.log(`dropping figure, interval: ${gameFlow}`);
    event.preventDefault();
    field.dropFigure();
    flowFunc(gameFlow);
    if(gameFlow) {
      clearInterval(gameFlow);
      gameFlow = setInterval(flowFunc, 1000);
    }
  } else {
    if(action)  event.preventDefault();
   // console.log(event.key);
    field.moveFigure(action);
  
}
}
})


console.log(`end of index.js`)