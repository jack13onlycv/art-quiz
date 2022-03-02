export function addAnswerLine(guessed) {
    if (guessed) {
        let div = document.createElement('div');
        div.className = "play-progress-dot visibilityNone";
        div.innerHTML = `${gamePicArray[item].author}`
        playPictureAnswersWrapper.append(div)
        setTimeout(() => {
            div.classList.add('animationRight')
            div.classList.remove('visibilityNone')
        }, (index + 1) * 100)
    }
}