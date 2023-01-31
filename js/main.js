const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");

// inputテキスト入力。合っているかどうかを判定。
typeInput.addEventListener("input", () => {

    // タイプ音をつける
    typeSound.play();
    typeSound.currentTime = 0;

    const sentenceArray = typeDisplay.querySelectorAll("span");
    const arrayValue = typeInput.value.split("");
    let correct = true;
    sentenceArray.forEach((characterSpan, index) => {
        if(arrayValue[index] == null) {
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
            correct = false;
        } else if(characterSpan.innerText == arrayValue[index]) {
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        } else {
            characterSpan.classList.add("incorrect");
            characterSpan.classList.remove("correct");

            wrongSound.volume = 0.3;
            wrongSound.play();
            wrongSound.currentTime = 0;
            correct = false;
        }
    });

    if(correct == true) {
        correctSound.play();
        correctSound.currentTime = 0;
        RenderNextSentence();
    }
});


// 非同期でランダムな文章をとる
function GetRandomSentence() {
    return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then((data) => data.content);
}


// ランダムな文章を取得して、表示する
async function RenderNextSentence() {
    const sentence = await GetRandomSentence();
    typeDisplay.innerText = "";

    // 文章を１文字ずつ分割して、spanタグを生成する
    let oneText = sentence.split("");
    oneText.forEach((character) => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        typeDisplay.appendChild(characterSpan);
    }); 

    // テキストボックスの中身を消す
    typeInput.value = "";

    startTimer();
}


let startTime;
let originTime = 60;
function startTimer() {
    timer.innerText = originTime;
    startTime = new Date();
    setInterval(() => {
        timer.innerText = originTime - getTimerTime();
        if(timer.innerText <= 0) TimeUp();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

function TimeUp() {
    RenderNextSentence();
}

RenderNextSentence();