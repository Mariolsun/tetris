

class Game {
  get score() {
    return this._score;
  }

  set score(newScore) {
    console.log(`setting score + ${newScore}`);
    this._score = newScore;
    this.scoreElem.textContent = this._score;
  }
  
  get nextFigure() {
    return this._nextFigure;
  }

  set nextFigure(newFigure) {
    this.nextFigureElem.textContent = newFigure;
    this._nextFigure = newFigure;
  }

  constructor(scoreElem, nextFigureElem) {
    this._score = 0;
    this._nextFigure = 'G';
    this.scoreElem = scoreElem;
    this.nextFigureElem = nextFigureElem;
    this.tick = 1000;
    this.pause = 'true';

    
  }

  updateStats() {
    this.nextFigureElem.textContent = this.nextFigure;
    this.scoreElem.textContent = this.score;
  }

  onStart(fn) {
    this.start = fn;
  }

  onEnd(fn) {
    this.end = fn;
  }

  onPause(fn) {
    this.pause = fn;
  }

  async flow() {

  }




  

 
  
    
  
  

}