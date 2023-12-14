// https://www.youtube.com/watch?v=zpm_0VIw154&ab_channel=Wikodemedias

let newTable = { ...keyValuePairs };

let blockAnswer = document.getElementById("wordToGuess");
let score = document.getElementById("score");
let responses = [...document.getElementsByClassName("response")];

// Récupérez la modale
let modal = document.getElementById("myModal");
modal.style.display = "none";
// Récupérez l'élément <span> qui permet de fermer la modale
let closeModal = document.getElementsByClassName("closeModal")[0];
let modalText1 = document.getElementById("modalText1");
let modalText2 = document.getElementById("modalText2");

let cptScore = 0;

let answerObject = {};
let answer = null;

const chooseRandomAnswerInJson = () => {
  let keys = Object.keys(newTable);
  let randomIndex = Math.floor(Math.random() * keys.length);
  let randomWord = keys[randomIndex];
  answerObject = {};
  answerObject[randomWord] = newTable[randomWord];
  return Object.entries(answerObject)[0];
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const deleteAnswerFromTable = (keyToRemove) => {
  delete newTable[keyToRemove];
};

const reinitializeTable = () => {
  newTable = { ...keyValuePairs };
};

const chooseThreeRandomDifferentAnswersInJson = () => {
  let arrayShuffled = shuffleArray(Object.values(newTable));
  arrayShuffled = arrayShuffled.slice(0, 3);
  return arrayShuffled;
};

const initializeGame = () => {
  score.textContent = cptScore;
  answer = chooseRandomAnswerInJson();
  blockAnswer.textContent = answer[0];
  deleteAnswerFromTable(answer[0]);
  let fourPropositions = chooseThreeRandomDifferentAnswersInJson();
  fourPropositions.push(answer[1]); // 1 is the Jap version of the answer
  let arrayShuffled = shuffleArray(fourPropositions);
  let index = 0;
  responses.forEach((rep) => {
    rep.textContent = arrayShuffled[index];
    index++;
  });
};

const checkAnswer = (e) => {
  let valueClicked = e.target.textContent;
  if (valueClicked !== answer[1]) {
    modal.style.display = "block";
    modalText1.textContent = "Vous avez perdu 😿";
    modalText2.innerHTML = `La réponse était <strong>${answer[1]}</strong>`;

    cptScore = 0;
    reinitializeTable();
    return initializeGame();
  }
  if (cptScore === 60) {
    //window.alert(`Bravo ! <3`)
    modal.style.display = "block";
    modalText1.textContent = `❤️❤️ Bravo ! ❤️❤️`;
    modalText2.textContent = "";
    cptScore = 0;
    reinitializeTable();
    return initializeGame();
  }
  cptScore++;
  initializeGame();
};

closeModal.onclick = function () {
  modal.style.display = "none";
};

// Lorsque l'utilisateur clique en dehors de la modale, fermez-la également
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

responses.forEach((rep) => {
  rep.addEventListener("click", checkAnswer);
});

initializeGame();
