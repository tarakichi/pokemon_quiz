const fs = require("fs");
const path = require("path");

const pokemonData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/pokemonNameMap.json"))
);

const MAX_QUESTIONS = 10;

const quizState = {};

function getRandomQuestion() {
    const random = pokemonData[Math.floor(Math.random() * pokemonData.length)];
    return {
        id: random.id,
        ja: random.ja,
        sprite_url: `/sprites/${random.id}.png`,
    };
}

function initQuiz(roomId) {
    quizState[roomId] = {
        count: 0,
        answered: false,
        currentQuestion: null,
    };
}

function nextQuestion(roomId) {
    if (!quizState[roomId]) initQuiz(roomId);
    quizState[roomId].count++;
    quizState[roomId].answered = false;
    quizState[roomId].currentQuestion = getRandomQuestion();
    return quizState[roomId];
}

function isFinished(roomId) {
    return quizState[roomId]?.count > MAX_QUESTIONS;
}

function getCurrentQuestion(roomId) {
    return quizState[roomId]?.currentQuestion;
}

function markAnswered(roomId) {
    if (quizState[roomId]) quizState[roomId].answered = true;
}

function isCorrectAnswer(roomId, answer) {
    const correct = quizState[roomId]?.currentQuestion?.ja;
    if (!correct) return false;
    const normalize = (str) => {
        str.replace(/[ぁ-ん]/g, (s) => {
            String.fromCharCode(s.charCodeAt(0) + 0x60)
        });
    }
    
    return normalize(answer) === normalize(correct);
}

function sendNextQuestion(io, roomId) {
    const question = nextQuestion(roomId);
    io.to(roomId).emit("quiz-question", question);
}

function checkAnswer(io, roomId, socket, answer) {
    
}

function resetQuiz(roomId) {
    delete quizState[roomId];
}

module.exports = {
    initQuiz,
    nextQuestion,
    isFinished,
    getCurrentQuestion,
    markAnswered,
    isCorrectAnswer,
    resetQuiz,
    MAX_QUESTIONS,
};