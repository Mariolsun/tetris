

class Game {
  get score() {
    return this._score;
  }

  set score(newScore) {
  //  console.log(`setting score + ${newScore}`);
    this._score = newScore;
    this.scoreElem.textContent = this._score;
  }
  
  get nextFigure() {
    return this._nextFigure;
  }

 /* set nextFigure(newFigure) {
    this.nextFigureElem.textContent = newFigure;
    this._nextFigure = newFigure;
  } */

  constructor(scoreElem, pauseBanner) {
    this._score = 0;
    this._nextFigure = 'G';
    this._tickCount = 0;
    this.scoreElem = scoreElem;
    this.pauseBanner = pauseBanner;
    this.tick = 1000;
    this.isRunning = false;

    
  }

  updateStats() {
    this.scoreElem.textContent = this.score;
  }

  onStart(fn) {
    this.start = fn;
  }

  onPause(fn) {
    this.pause = fn;
  }

  onReset(fn) {
    this.reset = fn;
  }

  reset(tick, flowFunc) {
    this.pauseBanner.newGame();
    this.tick = tick;
    this.flowFunc = flowFunc; 
  }

  start() {
    this.flow = setInterval(this.flowFunc, this.tick);
    this.pauseBanner.pause(false);
    this.isRunning = true;
  }

  pause() {
    clearInterval(this.flow);
    this.pauseBanner.pause(true);
    this.isRunning = false;
  }

  gameOver()  {
    clearInterval(this.flow);
    this.pauseBanner.gameOver();
    this.isRunning = false;
  }

  updateTick() {
    this._tickCount += 1;
    if(this.tick > 200 && this._tickCount > 100) {
      this.tick *= 0.8;
      this._tickCount = 0;
      clearInterval(this.flow);
      this.flow = setInterval(this.flowFunc, this.tick);
    }
    console.log(`tick updated ${this.tick} ${this._tickCount}`);
  }

  

 
  
    
  
  

}