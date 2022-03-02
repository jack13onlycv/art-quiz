// import {gamePic} from './modules/classPlayPic.js'

const playPictureAnswersWrapper = document.querySelector('.play-picture-question-answers-wrapper')
const playPicturePicture = document.querySelector('.play-picture-question-picture-background')
const playProgressDotWrapper = document.querySelector('.play-progress-dot-wrapper')
const mainPlayWrapper = document.querySelector('.main-play-wrapper')
const questionText = document.querySelector('.play-picture-question-text')
const playAuthorAnswersWrapper = document.querySelector('.play-author-question-wrapper')
const playPictureQuestion = document.querySelector('.play-picture-question-picture')
const navHome = document.querySelector('.nav-button-home')
const navHomeCat = document.querySelector('.cat-nav-button-home')
const navCat = document.querySelector('.nav-button-back')
const navCatCat = document.querySelector('.cat-nav-button-back')
const picGameCat = document.querySelector('.picture-game-cat')
const authorGameCat = document.querySelector('.author-game-cat')
const catScore = document.querySelector('.cat-author-games')
const catMainWrapper = document.querySelector('.cat-main-wrapper')
const mainWrapper = document.querySelector('main')
const startPageWrapper = document.querySelector('.start-page-wrapper')
const timerView = document.querySelector('.play-progress-timer')
const settingsWrapper = document.querySelector('.settings-main-wrapper')
const settingsEnterExit = document.querySelectorAll('.settings-show-hide')
const timerSelector = document.querySelector('.select-timer')
const timerIsAvailable = document.querySelector('.timer-available')
const soundIsAvailable = document.querySelector('.sound-mute')
const soundVolumeInput = document.querySelector('.sound-volume')
const languageButtons = document.querySelectorAll('.lang-radio')
const resetButton = document.querySelector('.reset-all')
const loader = document.querySelector('.loader')
const musicPlayer = document.querySelector('.music-settings')


let receivedDesc;
const gamePicArray = []
const rounds = []
let currentRoundNumber = 0 // Round counter
let currentRoundStepCounter = 0
let questionAnswers;
let playAuthorAnswers;
let isNextAnswerChanging = false
let isNextQuestion = false
let timerId
let isCheckingAnswer = false
let isReadyToKeyAnswerPress = false
let isReadyToKeyNextPress = false
let prevRoundCounter = 0

let settings = {
    isTimer : false,
    timerTime : 15000,
    isSound : false,    
    volume : 50,
    lang : 'ru',
    winStat : [],
    played : [[],[]]
}

const langArray = [
    ['Картины', 'Авторы', 'Настройки', 'Звук / Музыка', 'Таймер', 'Музыка', 'Остановить музыку', 'Сбросить результаты', 'Назад',
     'Продолжить', 'Рестарт', 'Следующий', 'В полный экран'],
    ['Paintings', 'Artists', 'Settings', 'Sound / Music', 'Timer', 'Play music', 'Stop music', 'Reset score', 'Back',
    'Continue', 'Restart', 'Next', 'Fullscreen']
]

setTimeout(() => {
    loader.style.display = 'none'
}, 1100)

load()

picGameCat.addEventListener('click', () => {
    sounds.playSoundButttonClick()
    addCategories('pic')
    startPageWrapper.classList.add('main-hide')
    startPageWrapper.classList.remove('main-visible')
    catMainWrapper.classList.add('main-visible')
    catMainWrapper.classList.remove('main-hide')
    mainWrapper.classList.remove('overflow-full')
})

authorGameCat.addEventListener('click', () => {    
    sounds.playSoundButttonClick()
    addCategories('author')
    startPageWrapper.classList.add('main-hide')
    startPageWrapper.classList.remove('main-visible')
    catMainWrapper.classList.add('main-visible')
    catMainWrapper.classList.remove('main-hide')
    mainWrapper.classList.remove('overflow-full')
})

settingsEnterExit.forEach(item => 
    item.addEventListener('click', () => {
        sounds.playSoundButttonClick()
        if (settingsWrapper.classList.contains('main-hide')) {
            settingsWrapper.classList.remove('main-hide')
            settingsWrapper.classList.add('main-visible')
            startPageWrapper.classList.remove('main-visible')
            startPageWrapper.classList.add('main-hide')
        } else {
            startPageWrapper.classList.remove('main-hide')
            startPageWrapper.classList.add('main-visible')
            settingsWrapper.classList.remove('main-visible')
            settingsWrapper.classList.add('main-hide')
        }
    })
)


//--------------LOADER-----------------

async function loadImageDescriptionFromJson() {  
    const res = await fetch('./json/images.json');
    receivedDesc = await res.json(); 
    await receivedDesc.forEach(item => gamePicArray.push(new GamePic(item, receivedDesc.length)))
    randomPicForStartPage()
    gamePicArray.forEach((item, index) => {
        if (settings.winStat[index]) item.guessed = true
    })
    // currentRoundNumber = Math.floor(1 + Math.random()*23)
    // startPlay()
}

//make arrays for 24 rounds
function makeRounds() {
    for (let i = 0, j = -1; i < 240; i++) {
        if (i % 10 === 0) {
            j++
            rounds.push([])         
        }
        rounds[j].push(i)
    }
}

//--------------- NAV ----------------
navHome.addEventListener('click', () => {
    sounds.playSoundButttonClick()
    const popup = document.querySelector('.result-answer-popup')
    if (popup) hideFinalScreen(popup)
    mainWrapper.classList.add('overflow-full')
    goToMainMenu()
})
navCat.addEventListener('click', () => {
    sounds.playSoundButttonClick()
    goToCat()
})
navCatCat.addEventListener('click', () => {
    sounds.playSoundButttonClick()
    catMainWrapper.classList.remove('main-visible')
    catMainWrapper.classList.add('main-hide')
    setTimeout(() => {
        currentRoundNumber <= 11 ? addCategories('pic') : addCategories('author')
    goToCat()
    }, 300) 
})
navHomeCat.addEventListener('click', () => {
    sounds.playSoundButttonClick()
    catMainWrapper.classList.add('main-hide')
    catMainWrapper.classList.remove('main-visible')
    mainWrapper.classList.add('overflow-full')
    goToMainMenu()
})

// --------------- SAVE AND LOAD ---------------------

function load() {
    if (!localStorage.getItem('jack13only-art-quiz-settings')) {
      settings.played.forEach(item => {
          item.length = 12;
          item.fill(false)
      });
      save()
    } else {
      settings = JSON.parse(localStorage.getItem('jack13only-art-quiz-settings'))
    }    
    timerSelector.value = settings.timerTime
    timerIsAvailable.checked = settings.isTimer
    soundIsAvailable.checked = settings.isSound
    soundVolumeInput.value = settings.volume
    languageButtons.forEach(item => {
        if (item.value === settings.lang) item.checked = true
    })
    changeLanguage(settings.lang)
    makeRounds()
    loadImageDescriptionFromJson()

}

function save() {
    localStorage.setItem('jack13only-art-quiz-settings', JSON.stringify(settings))
}


//-------------- SETTINGS -------------
timerSelector.addEventListener('change', selectTimerTime)
timerIsAvailable.addEventListener('change', toggleTimer)
soundIsAvailable.addEventListener('change', () => {
    toggleSound()
    sounds.musicVolume()
})
soundVolumeInput.addEventListener('input', changeVolume)
languageButtons.forEach(item => {
    item.addEventListener("change", () => {
      settings.lang = item.value
      save()
    //   loadLang()
    })
})
resetButton.addEventListener('click', () => {
    let div = document.createElement('div');
    div.className = "vjuh";
    mainWrapper.prepend(div)
    setTimeout(() => {
        div.remove()
    }, 1000)
    sounds.playSoundVjuh()
    restartGame()
})
languageButtons.forEach(item => {
    item.addEventListener('change', () => {
        changeLanguage(item.value)
    })
})


document.addEventListener('keydown', function(event) {
    if (isReadyToKeyAnswerPress) {
        switch (event.code) {
            case 'Digit1':
                checkRightAnswer(0)
                break;
            case 'Numpad1':
                checkRightAnswer(0)
                break;
            case 'Digit2':
                checkRightAnswer(1)
                break;
            case 'Numpad2':
                checkRightAnswer(1)
                break;
            case 'Digit3':
                checkRightAnswer(2)
                break;
            case 'Numpad3':
                checkRightAnswer(2)
                break;
            case 'Digit4':
                checkRightAnswer(3)
                break;
            case 'Numpad4':
                checkRightAnswer(3)
                break;
        }
    }

    if (isReadyToKeyNextPress && event.code === 'Space') {
        isReadyToKeyNextPress = false
        const popup = document.querySelectorAll('.result-answer-popup')
        setTimeout(() => {
            popup.forEach(item => hideFinalScreen(item))
        }, 100)        
        nextPlay()          
        isCheckingAnswer = false
    }
})

document.addEventListener('click', function (event) {

    if (!event.target.hasAttribute('data-fullscreen')) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  
  }, false);

//----------------- FOR PICTURE GAME -------------------------
//add 4 answers
function insertAnswer(gamePicArrayItem) {
    playPictureAnswersWrapper.innerHTML = ''
       
    gamePicArray[gamePicArrayItem].randomAnswerArray.forEach((item, index) => {
        let div = document.createElement('div');
        div.className = "play-picture-question-answer visibilityNone";
        div.innerHTML = `${gamePicArray[item].author}`
        playPictureAnswersWrapper.append(div)
        setTimeout(() => {
            div.classList.add('animationRight')
            div.classList.remove('visibilityNone')
            if (index === 3) isNextAnswerChanging = false 
        }, (index + 1) * 100)
    })
    questionAnswers = document.querySelectorAll('.play-picture-question-answer')
    questionAnswers.forEach((item, index) => {
        item.addEventListener('click', () => {            
            if (!isNextAnswerChanging) {
                isNextAnswerChanging = true
                checkRightAnswer(index)
            }
        })
    })    
}

//add picture
function insertPicture(gamePicArrayItem) {
    const img = new Image();
    // img.src = `./assets/img/${gamePicArray[gamePicArrayItem].imageNum}.jpg`
    img.src = `https://raw.githubusercontent.com/jack13only/art-quiz-pictures/main/img/${gamePicArray[gamePicArrayItem].imageNum}.jpg`
    img.onload = () => {      
        playPicturePicture.style.backgroundImage = `url('${img.src}')`
        // playPicturePicture.classList.remove('visibilityNone')
        playPicturePicture.classList.add('animationRight')
        playPicturePicture.classList.remove('visibilityNone')
    }; 
    playPicturePicture.addEventListener('animationend', () => {
        playPicturePicture.classList.remove('animationRight')
        playPicturePicture.classList.remove('animationLeft')
    });
}

//add picture and answers to screen
function readyToPlay(gamePicArrayItem) {
    insertPicture(gamePicArrayItem)
    // if (gamePicArray[gamePicArrayItem].randomAnswerArray.length === 1) {
        gamePicArray[gamePicArrayItem].randomAnswer(gamePicArray)
    // }
    insertAnswer(gamePicArrayItem) 
    if (settings.isTimer) setTimer(settings.timerTime)
    preloadPic(gamePicArrayItem)
}

function preloadPic(gamePicArrayItem) {
    const preloadImg = new Image();
    // preloadImg.src = `./assets/img/${gamePicArray[gamePicArrayItem + 1].imageNum}.jpg`
    preloadImg.src = `https://raw.githubusercontent.com/jack13only/art-quiz-pictures/main/img/${gamePicArray[gamePicArrayItem + 1].imageNum}.jpg`
}

//next round
function nextPlay() {
    if (currentRoundStepCounter === 9) {
        saveProgress()
        settings.played[currentRoundNumber < 12 ? 0 : 1][currentRoundNumber < 12 ? currentRoundNumber : currentRoundNumber - 12] = true
        playPictureAnswersWrapper.innerHTML = ''
        playProgressDotWrapper.innerHTML = ''
        playPicturePicture.style.backgroundImage = `none`
        playAuthorAnswersWrapper.innerHTML = ''
        sounds.playSoundLevelCompleted()
        insertRoundResults(currentRoundNumber)
        saveWinStatistics()
    } else {
        isReadyToKeyAnswerPress = true
        if (currentRoundNumber < 12) {
            readyToPlay(rounds[currentRoundNumber][++currentRoundStepCounter])
        } else {
            readyToPlayAuthor(rounds[currentRoundNumber][++currentRoundStepCounter])
        }
    }    
    isNextQuestion = false
}

//----------------- FOR AUTHOR GAME -------------------------

function insertAnswersPictures(gamePicArrayItem) {
    playAuthorAnswersWrapper.innerHTML = ''

    gamePicArray[gamePicArrayItem].randomAnswerArray.forEach((item, index) => {
        let div = document.createElement('div');
        div.className = "play-author-answer"
        playAuthorAnswersWrapper.append(div)
        let img = new Image();
        // img.src = `./assets/img/${item}.jpg`
        img.src = `https://raw.githubusercontent.com/jack13only/art-quiz-pictures/main/img/${item}.jpg`
        img.onload = () => {      
            setTimeout(() => {
                div.style.backgroundImage = `url('${img.src}')`                
                div.classList.add('filter')
                if (index === 3) isNextAnswerChanging = false 
                setTimeout(() => {
                    div.classList.remove('filter')
                }, 600)
            }, index * 200)
        }; 
    })
    playAuthorAnswers = document.querySelectorAll('.play-author-answer')
    playAuthorAnswers.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (!isNextAnswerChanging) {
                isNextAnswerChanging = true
                checkRightAnswer(index)
            }
        })
    })  
}

function readyToPlayAuthor(gamePicArrayItem) {
    // if (gamePicArray[gamePicArrayItem].randomAnswerArray.length === 1) {
        gamePicArray[gamePicArrayItem].randomAnswer(gamePicArray)
    // }
    insertAnswersPictures(gamePicArrayItem)
    insertQuestion(`Какую картину написал ${gamePicArray[gamePicArrayItem].author}?`)
    if (settings.isTimer) setTimer(settings.timerTime)
}

// ------------------------FOR ALL GAMES----------------------------

//start new round
function startPlay(index) {
    if (index !== undefined) currentRoundNumber = index

    currentRoundStepCounter = 0
    timerView.innerHTML = ``
    let gamePicArrayItem = rounds[currentRoundNumber][currentRoundStepCounter]

    if (currentRoundNumber < 12) {
        playPictureQuestion.classList.remove('visibilityAbsNone')
        playAuthorAnswersWrapper.classList.add('visibilityAbsNone')

        readyToPlay(gamePicArrayItem) //picture game
        if (settings.lang === 'ru') {
            insertQuestion('Кто написал эту картину?')
        } else {
            insertQuestion('Who wrote this painting?')
        }
    } else {
        playAuthorAnswersWrapper.classList.remove('visibilityAbsNone')
        playPictureQuestion.classList.add('visibilityAbsNone')

        readyToPlayAuthor(gamePicArrayItem) //author game
        if (settings.lang === 'ru') {
            insertQuestion(`Какую картину написал ${gamePicArray[gamePicArrayItem].author}?`)
        } else {
            insertQuestion(`What painting did ${gamePicArray[gamePicArrayItem].author} write?`)
        }
    }
    isReadyToKeyAnswerPress = true
}

function insertQuestion(question) {
    questionText.innerHTML = `${question}`
}

function checkRightAnswer(index) {
    isReadyToKeyAnswerPress = false
    if (isCheckingAnswer) return 
    isCheckingAnswer = true
    timerView.innerHTML = ``
    let roundCounter = currentRoundNumber * 10 + currentRoundStepCounter
    if (index === gamePicArray[roundCounter].rightAnswer) {
        sounds.playSoundRightAnswer()
        gamePicArray[roundCounter].tempGuessed = true
        addAnswerLine(true)
        insertResultAnswerPopUp(true, roundCounter)
    } else {
        sounds.playSoundWrongAnswer()
        addAnswerLine(false)
        insertResultAnswerPopUp(false, roundCounter)
    }
    // if (settings.isTimer) stopTimer()
    stopTimer()    
}

function addAnswerLine(guessed) {
    let div = document.createElement('div');

    if (guessed) {
        div.className = "play-progress-dot win-dot"
        div.innerHTML = `&#10003;`
    } else {
        div.className = "play-progress-dot loose-dot"
        div.innerHTML = `&#10007;`
    }
    playProgressDotWrapper.append(div)
}

function insertResultAnswerPopUp(guessed, index, score = false) {
    let div = document.createElement('div');
    const img = new Image();
    // img.src = `./assets/img/${gamePicArray[index].imageNum}.jpg`    
    img.src = `https://raw.githubusercontent.com/jack13only/art-quiz-pictures/main/img/${gamePicArray[index].imageNum}.jpg`    
    div.append(img)

    const divAuthor = document.createElement('div');
    divAuthor.style.fontWeight = '700'    
    divAuthor.innerHTML = `${gamePicArray[index].author}`

    const divName = document.createElement('div');
    divName.innerHTML = `${gamePicArray[index].name}`

    const divYear = document.createElement('div');
    divYear.innerHTML = `${gamePicArray[index].year}`

    const divButton = document.createElement('div');
    divButton.innerHTML = settings.lang === 'ru' ? langArray[0][9] : langArray[1][9]
    
    div.append(divAuthor)
    div.append(divName)
    div.append(divYear)
    div.append(divButton)    

    if (!score) {

        mainPlayWrapper.append(div)

        isReadyToKeyNextPress = true

        divButton.addEventListener('click', () => {
            // setTimeout(() => {})
            sounds.playSoundButttonClick()
            setTimeout(() => {
                nextPlay()
                hideFinalScreen(div)
                isCheckingAnswer = false
            }, 100)
        }, { once: true })

        if (guessed) {
            div.className = "result-answer-popup win hidden-answer-popup"
            divButton.className = "button-next-on-popup win"
        } else {
            div.className = "result-answer-popup loose hidden-answer-popup"
            divButton.className = "button-next-on-popup loose"
        }

    } else {

        div.className = "result-answer-popup hidden-answer-popup fullscreen-score"
        divButton.className = "button-next-on-popup win"

        catMainWrapper.append(div)

        divButton.addEventListener('click', () => {
            sounds.playSoundButttonClick()
            hideFinalScreen(div)
            mainWrapper.classList.remove('overflow-full')
            isCheckingAnswer = false
        })
    }

    setTimeout(() => {
        div.classList.remove('hidden-answer-popup')
    }, 100) 
}

function saveWinStatistics(all = false) {
    if (settings.winStat.length === 0 || all) {
        settings.winStat.length = 240
        settings.winStat.fill(false)
    }
    rounds[currentRoundNumber].forEach(item => settings.winStat[item] = gamePicArray[item].guessed)
    save()
}

function saveProgress() {
    rounds[currentRoundNumber].forEach(item => gamePicArray[item].saveProgress())
    saveWinStatistics()
}

function resetProgress() {
    rounds[currentRoundNumber].forEach(item => gamePicArray[item].resetProgress())

}

function calculateRoundWins() {
    return rounds[currentRoundNumber].reduce((sum, current) => (gamePicArray[current].guessed ? 1 : 0) + sum ,0)
}

function insertRoundResults() {
    let div = document.createElement('div');
    div.className = "result-answer-popup hidden-answer-popup fullscreen"
    const divRoundResult = document.createElement('div');
    divRoundResult.className = "round-result"
    divRoundResult.innerHTML = `0 / 10`

    //restart round button
    const divButtonRestart = document.createElement('div');
    divButtonRestart.innerHTML = settings.lang === 'ru' ? langArray[0][10] : langArray[1][10]
    divButtonRestart.className = "button-next-on-popup loose"
    divButtonRestart.addEventListener('click', () => {
        sounds.playSoundButttonClick()
        hideFinalScreen(div)
        restartRound()
        startPlay()
    })

    const divButtonNext = document.createElement('div');
    divButtonNext.innerHTML = settings.lang === 'ru' ? langArray[0][11] : langArray[1][11]
    divButtonNext.className = "button-next-on-popup win"
    divButtonNext.addEventListener('click', () => {
        sounds.playSoundButttonClick()
        currentRoundNumber++
        hideFinalScreen(div)
        startPlay()
    })

    const divButtonMenu = document.createElement('div');
    divButtonMenu.innerHTML = settings.lang === 'ru' ? langArray[0][9] : langArray[1][9]
    divButtonMenu.className = "button-next-on-popup win"
    divButtonMenu.addEventListener('click', () => {
        resetProgress()
        hideFinalScreen(div)
        // goToMainMenu()
        if (currentRoundNumber <= 11) {
            addCategories('pic')
        } else {
            addCategories('author')
        }
        goToCat()
    })

    div.append(divRoundResult)
    div.append(divButtonRestart)
    if (!(currentRoundNumber === 11 || currentRoundNumber === 23)) {
        div.append(divButtonNext)
    }
    div.append(divButtonMenu)

    mainPlayWrapper.append(div)
    setTimeout(() => {
        div.classList.remove('hidden-answer-popup')
        addRoundScoreWithAnimation(currentRoundNumber, divRoundResult)
    }, 100)
}

function restartRound() {
    rounds[currentRoundNumber].forEach(item => {
        gamePicArray[item].reset()
    })    
    saveWinStatistics()
}

function restartGame() {
    gamePicArray.forEach(item => {
        item.reset()
    })
    settings.played.forEach(item => item.fill(false))
    saveWinStatistics(true)
}

function hideFinalScreen(div) {
    div.classList.add('hidden-answer-popup')
    // div.addEventListener('transitionend', () => {
    setTimeout(() => {    
        div.remove()
    }, 500)
}

function addRoundScoreWithAnimation(currentRoundNumber, divRoundResult) {
    for (let i = 0; i <= calculateRoundWins(currentRoundNumber); i++) {
        setTimeout(() => {
            divRoundResult.innerHTML = `${i} / 10`
        }, i * 150 + 500)
    }
}


function goToMainMenu() {
    playPictureAnswersWrapper.innerHTML = ''
    playProgressDotWrapper.innerHTML = ''
    playPicturePicture.style.backgroundImage = `none`
    playAuthorAnswersWrapper.innerHTML = ''
    mainPlayWrapper.classList.add('main-hide')
    mainPlayWrapper.classList.remove('main-visible')
    startPageWrapper.classList.add('main-visible')
    startPageWrapper.classList.remove('main-hide')
    isCheckingAnswer = false
    stopTimer()
}

function goToCat() {
    playPictureAnswersWrapper.innerHTML = ''
    playProgressDotWrapper.innerHTML = ''
    playPicturePicture.style.backgroundImage = `none`
    playAuthorAnswersWrapper.innerHTML = ''
    mainPlayWrapper.classList.add('main-hide')
    mainPlayWrapper.classList.remove('main-visible')
    catMainWrapper.classList.add('main-visible')
    catMainWrapper.classList.remove('main-hide')
    mainWrapper.classList.remove('overflow-full')
    isCheckingAnswer = false
    stopTimer()
}




function randomPicForStartPage() {

    let randomPicNumber = Math.floor(Math.random()*239)
    
    const imgPic = new Image();
    // imgPic.src = `./assets/img/${gamePicArray[randomPicNumber].imageNum}.jpg`
    imgPic.src = `https://raw.githubusercontent.com/jack13only/art-quiz-pictures/main/img/${gamePicArray[randomPicNumber].imageNum}.jpg`
    imgPic.onload = () => {      
        picGameCat.style.backgroundImage = `url('${imgPic.src}')`
    }
    const authorPic = new Image();
    // authorPic.src = `./assets/img/${gamePicArray[239 - randomPicNumber].imageNum}.jpg`
    authorPic.src = `https://raw.githubusercontent.com/jack13only/art-quiz-pictures/main/img/${gamePicArray[239 - randomPicNumber].imageNum}.jpg`
    authorPic.onload = () => {      
        authorGameCat.style.backgroundImage = `url('${authorPic.src}')`
    }
}


function addCategories(name) {

    catScore.innerHTML = ''
    let arrScore = allCatResults(name)
    let counter = 0
    let playedCounter = 0
    if (name !== 'pic') {
        playedCounter = 1
        counter = 120
    }
    arrScore.forEach((item, index) => {
        let counterX = counter
        let div = document.createElement('div');
        div.className = "cat-author-item";
        let divName = document.createElement('div');
        divName.className = "number-cat";
        divName.innerHTML = index < 9 ? `0${index + 1}` : `${index + 1}`
        div.append(divName)
        if (settings.played[playedCounter][index] !== false) {
            div.classList.add('played')
            let divCat = document.createElement('div');
            divCat.className = "score-cat";
            divCat.innerHTML = `${item ? item : 0} / 10`
            divCat.addEventListener('click', (e) => {
                sounds.playSoundButttonClick()
                catMainWrapper.classList.remove('main-visible')
                catMainWrapper.classList.add('main-hide')
                e.stopPropagation()
                setTimeout(() => {
                    addScoreCategory((name === 'pic' ? 0 : 12) + index)
                    goToCat()                    
                }, 300) 
            })
            div.append(divCat)
        }    

        div.addEventListener('click', () => {
            sounds.playSoundNewLevel()
            catMainWrapper.classList.add('main-hide')
            catMainWrapper.classList.remove('main-visible')
            mainPlayWrapper.classList.add('main-visible')
            mainPlayWrapper.classList.remove('main-hide')
            mainWrapper.classList.add('overflow-full')
            startPlay(counterX / 10)
        })

        const img = new Image();
        // img.src = `./assets/img/${gamePicArray[counter].imageNum}.jpg`
        img.src = `https://raw.githubusercontent.com/jack13only/art-quiz-pictures/main/img/${gamePicArray[counter].imageNum}.jpg`
        img.onload = () => {      
            div.style.backgroundImage = `url('${img.src}')`
        }; 

        catScore.append(div)
        counter += 10
    })
}

function addScoreCategory(counter) {
    // currentRoundNumber = counter
    catScore.innerHTML = ''
    rounds[counter].forEach((item, index) => {
        let div = document.createElement('div');
        div.className = "cat-author-item" 
        if (gamePicArray[item].guessed) div.classList.add('guessed') 

        const img = new Image();
        // img.src = `./assets/img/${gamePicArray[item].imageNum}.jpg`
        img.src = `https://raw.githubusercontent.com/jack13only/art-quiz-pictures/main/img/${gamePicArray[item].imageNum}.jpg`
        img.onload = () => {      
            div.style.backgroundImage = `url('${img.src}')`
        }; 
        catScore.append(div)
        div.addEventListener('click', () => {
            sounds.playSoundButttonClick()
            insertResultAnswerPopUp(true, item, true)
            mainWrapper.classList.add('overflow-full')
        })
    })
}

function allCatResults(name) {
    let arrScore = []
    let roundNumberTemp = currentRoundNumber
    name === 'pic' ? currentRoundNumber = 0 : currentRoundNumber = 12
    for (let i = 0; i < 12; i++) {
        arrScore.push(calculateRoundWins())
        currentRoundNumber++
    }
    currentRoundNumber = roundNumberTemp
    return arrScore
}

function setTimer(timerTime) {
    stopTimer()
    timerTime += 1000
    timerView.classList.remove('alert')
    timerId = setTimeout(function playTimer() {
        // timerView.classList.remove('timerAnimation')        
        timerTime -= 1000
        if (timerTime < 6000) timerView.classList.add('alert')
        timerView.innerHTML = `${timerTime / 1000}`
        timerView.classList.add('timerAnimation')
        timerView.addEventListener('animationend', () => {
            timerView.classList.remove('timerAnimation')  
        })
        timerTime > 0 ? timerId = setTimeout(playTimer, 1000) : checkRightAnswer(10)
    }, 1000)
}

function changeLanguage(lang) {
    if (lang === 'ru') {
        settings.lang = 'ru'
        document.querySelector('.picture-game-cat-text').innerHTML = langArray[0][0]
        document.querySelector('.author-game-cat-text').innerHTML = langArray[0][1]
        document.querySelector('.start-page-wrapper > .settings-show-hide').innerHTML = langArray[0][2]
        document.querySelector('.sound-name').innerHTML = langArray[0][3]
        document.querySelector('.timer-name').innerHTML = langArray[0][4]
        document.querySelector('.music-settings').innerHTML = langArray[0][5]
        resetButton.innerHTML = langArray[0][7]
        document.querySelector('.settings-main-wrapper > .settings-show-hide').innerHTML = langArray[0][8]
        document.querySelector('.fullscreen-settings').innerHTML = langArray[0][12]
    } else {
        settings.lang = 'en'
        document.querySelector('.picture-game-cat-text').innerHTML = langArray[1][0]
        document.querySelector('.author-game-cat-text').innerHTML = langArray[1][1]
        document.querySelector('.start-page-wrapper > .settings-show-hide').innerHTML = langArray[1][2]
        document.querySelector('.sound-name').innerHTML = langArray[1][3]
        document.querySelector('.timer-name').innerHTML = langArray[1][4]
        document.querySelector('.music-settings').innerHTML = langArray[1][5]
        resetButton.innerHTML = langArray[1][7]
        document.querySelector('.settings-main-wrapper > .settings-show-hide').innerHTML = langArray[1][8]
        document.querySelector('.fullscreen-settings').innerHTML = langArray[1][12]
    }
    save()
}


function stopTimer() {
    clearTimeout(timerId)
}

function selectTimerTime() {
    settings.timerTime = +timerSelector.value
    save()
}

function toggleTimer() {
    settings.isTimer = timerIsAvailable.checked
    save()
}

function toggleSound() {
    settings.isSound = soundIsAvailable.checked
    save()
}

function changeVolume() {
    settings.volume = soundVolumeInput.value
    sounds.volumeChange(settings.volume)
    sounds.musicVolume()
    save()
}


class Sounds {
    constructor(volume) {
        this.volume = volume / 100;
        this.audio = new Audio()
        this.srcArray = ['./assets/music/ftl-01.mp3',
                         './assets/music/ftl-02.mp3',
                         './assets/music/ftl-03.mp3',
                         './assets/music/ftl-04.mp3'];
        this.isMusicPlaying = false;                 
    }

    volumeChange(volume) {
        this.volume = volume / 100
        this.audio.volume = this.volume
    }

    playMusic() {
        this.isMusicPlaying = true
        this.srcArray.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5)
        this.audio.src = this.srcArray[0]
        this.musicVolume()
        this.audio.play()
        this.audio.addEventListener('ended', () => {
            this.playMusic()
        }, { once: true });
    }

    pauseMusic() {
        this.isMusicPlaying = false
        this.audio.pause()
    }

    getMusic() {
        this.isMusicPlaying ? this.pauseMusic() : this.playMusic()
    }

    musicVolume() {
        if (this.isMusicPlaying && !settings.isSound) {
            this.audio.volume = 0
        } else {
            this.audio.volume = this.volume
        }
    }

    playSoundButttonClick() {
        if (settings.isSound) {
            let audio = new Audio('./assets/sounds/click.mp3')
            audio.volume = this.volume
            audio.play()
        }
    }

    playSoundWrongAnswer() {
        if (settings.isSound) {
            let audio = new Audio('./assets/sounds/wrong-answer.mp3')
            audio.volume = this.volume
            audio.play()
        }
    }

    playSoundRightAnswer() {
        if (settings.isSound) {
            let audio = new Audio('./assets/sounds/right-answer.mp3')
            audio.volume = this.volume
            audio.play()
        }
    }

    playSoundLevelCompleted() {
        if (settings.isSound) {
            let audio = new Audio('./assets/sounds/level-completed.mp3')
            audio.volume = this.volume
            audio.play()
        }
    }

    playSoundNewLevel() {
        if (settings.isSound) {
            let audio = new Audio('./assets/sounds/new-level.mp3')
            audio.volume = this.volume
            audio.play()
        }
    }

    playSoundVjuh() {
        if (settings.isSound) {
            let audio = new Audio('./assets/sounds/vjuh.mp3')
            audio.volume = this.volume
            audio.play()
        }
    }
}

// let sounds = new Sounds(settings.volume)


class GamePic {
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


let sounds = new Sounds(settings.volume)
musicPlayer.addEventListener('click', () => {
    sounds.getMusic()
    musicPlayer.classList.toggle('playing')
})


console.log('----------- Анимации -----------');
console.log('Вжух анимация сброса результатов прогресса в настройках');
console.log('Индикация включенного плеера в настройках');
console.log('Правильного ответа на всплывающем окне, зеленая тень по краю');
console.log('Неправильного ответа на всплывающем окне, красная тень по краю');
console.log('Движения окна влево за границу экран и слева изза границы экрана ');
console.log('Появления дотов правильных и неправильных ответов');
console.log('Повление 4х картин-ответов с блуром');
console.log('Лого на главном экране');
console.log('Увеличение и покачивание картин при наведении');
console.log('Движение по квадрату кнопок "домой" и "категории" при наведении');
console.log('Появление с увеличением цифр таймера');
console.log('--------------------------------');
console.log('-------- Доп функционал --------');
console.log('Хранение score в localStorage и его обеуление из настроек -    +1');
console.log('Английский и русский языки --------------------------------    +5');
console.log('Музыкальный плеер с рандомным проигрыванием песен ---------    +2');
console.log('Громкость и mute плеера совмещены с общей озвучкой');
console.log('Игра в полный экран (в настройках) ------------------------    +2');
console.log('Управление с клавиатуры------------------------------------    +5');
console.log('1 или num1 - 1 ответ, 2 или num2 - 2 ответ и тд');
console.log('Пробел - "далее" на всплывающем окне результата');
console.log('Итого -----------------------------------------------------   +15');
