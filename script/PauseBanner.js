class PauseBanner {
    constructor(pauseBannerElem, pauseBannerTextElem) {
        this.pauseBannerElem = pauseBannerElem;
        this.pauseBannerTextElem = pauseBannerTextElem;
    }
    
    newGame () {
        this.pauseBannerTextElem.textContent = 'press Enter to start';
        this.pauseBannerElem.style.visibility = 'visible';
    }

    pause (condition) {
        if(condition) {
            this.pauseBannerTextElem.textContent = 'pause';
            this.pauseBannerElem.style.visibility = 'visible';
        } else {
            this.pauseBannerElem.style.visibility = 'hidden';
        }
    }

    gameOver () {
        this.pauseBannerTextElem.textContent = 'Game Over!';
        this.pauseBannerElem.style.visibility = 'visible';
    }
}