// https://www.youtube.com/watch?v=zpm_0VIw154&ab_channel=Wikodemedias

let newTable = {...keyValuePairs}

let blockAnswer = document.getElementById('wordToGuess')
let score = document.getElementById('score')
let responses = [...document.getElementsByClassName('response')]

let cptScore = 0

let answerObject = {}
let answer = null;

const chooseRandomAnswerInJson = () => {
    let keys = Object.keys(newTable);
    let randomIndex = Math.floor(Math.random() * keys.length);
    let randomWord = keys[randomIndex];
    answerObject = {}
    answerObject[randomWord] = newTable[randomWord]
    return Object.entries(answerObject)[0]
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

const deleteAnswerFromTable = (keyToRemove) => {
    delete newTable[keyToRemove]
}

const reinitializeTable = () => {
    newTable = {...keyValuePairs}
}

const chooseThreeRandomDifferentAnswersInJson = () => {
    let arrayShuffled = shuffleArray(Object.values(newTable))
    arrayShuffled = arrayShuffled.slice(0, 3)
    return arrayShuffled
}

const initializeGame = () => {
    score.textContent = cptScore
    answer = chooseRandomAnswerInJson()
    blockAnswer.textContent = answer[0]
    deleteAnswerFromTable(answer[0])
    let fourPropositions = chooseThreeRandomDifferentAnswersInJson()
    fourPropositions.push(answer[1]) // 1 is the Jap version of the answer
    let arrayShuffled = shuffleArray(fourPropositions)
    let index = 0;
    responses.forEach((rep) => {
        rep.textContent = arrayShuffled[index]
        index++;
    }
    )
}

const checkAnswer = (e) => {
    let valueClicked = e.target.textContent
    if (valueClicked != answer[1]) {
        window.alert(`Vous avez perdu, la réponse était ${answer[1]}`)
        cptScore = 0
        reinitializeTable()
        return initializeGame()
    }
    if(cptScore === 20){
        window.alert(`Bravo ! <3`)
        cptScore = 0
        reinitializeTable()
        return initializeGame()
    }
    cptScore++
    initializeGame()
}

responses.forEach(rep => {
    rep.addEventListener("click", checkAnswer)
})

initializeGame()
