export class GamePic {
    constructor(item, lenght) {
        this.author = item.author;
        this.imageNum = item.imageNum;
        this.name = item.name;
        this.year = item.year;
        this.rightAnswer = 0;
        this.guessed = false;
        this.tempGuessed = false;
        this.randomAnswerArray = [+this.imageNum]
        this.ArrayLength = lenght
    }

    randomAnswer(gamePicArray) {
        this.randomAnswerArray = [+this.imageNum]
        while (this.randomAnswerArray.length < 4) {
            let a = Math.floor(Math.random()*this.ArrayLength)
            this.randomAnswerArray.some((item) => gamePicArray[item].author === gamePicArray[a].author) ? this.randomAnswer(gamePicArray) : this.randomAnswerArray.push(a)
        }
        this.randomAnswerArray.sort(() => Math.random() - 0.5)
        this.rightAnswer = this.randomAnswerArray.indexOf(+this.imageNum)
    }

    reset() {
        this.guessed = false;
        this.tempGuessed = false;
        this.randomAnswerArray = [+this.imageNum]
        this.rightAnswer = 0;
    }

    saveProgress() {
        this.guessed = this.tempGuessed;
        this.tempGuessed = false;
    }

    resetProgress() {
        this.tempGuessed = false;
    }
}