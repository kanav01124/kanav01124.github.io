let score = 0;

async function fetchTriviaQuestions(difficulty, numQuestions) {
    const url = `https://opentdb.com/api.php?amount=10&difficulty=medium`;
    console.log('Fetching questions from:', url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        console.log('Fetched data:', data); 
        return data.results; 
    } catch (error) {
        console.error('Error fetching trivia questions:', error);
        return []; 
    }
}

async function displayNextQuestion() {
    const currentQuestion = await getNextQuestion();
    if (currentQuestion) {
        document.getElementById('question-text').innerText = currentQuestion.question;
        displayAnswers(currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer));
        updateProgressBar()
    } else {
        console.log('No more questions.');
    }
}

let questions = [];
let questionIndex = 0;
async function getNextQuestion() {
    if (questions && questionIndex < questions.length) {
        return questions[questionIndex++];
    } else {
        questions = await fetchTriviaQuestions();
        questionIndex = 0;
        return questions[questionIndex++];
    }
}

async function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    const numQuestions = document.getElementById('num-questions').value;
    if (numQuestions < 1 || numQuestions > 50) {
        alert('Please enter a number of questions between 1 and 50.');
        return;
    }
    document.getElementById('start-screen').classList.add('hide');
    document.getElementById('trivia-screen').classList.remove('hide');
    questions = await fetchTriviaQuestions(difficulty, numQuestions);
    questionIndex = 0;
    updateScore();
    displayNextQuestion();
}


document.getElementById('start-button').addEventListener('click', startGame);

document.getElementById('next-button').addEventListener('click', () => {
    if (questionIndex < questions.length-1) {
        questionIndex++;
        displayNextQuestion();
        document.getElementById('feedback').classList.add('hide'); 
        updateProgressBar();
    } else {
        console.log('No more questions.');
        document.getElementById('next-button').disabled = true;
    }
});

function displayAnswers(answers) {
    const answerButtonsContainer = document.getElementById('answer-buttons');
    answerButtonsContainer.innerHTML = ''; 
    answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer));
        answerButtonsContainer.appendChild(button);
    });
}

function selectAnswer(answer) {
    const feedbackElement = document.getElementById('feedback');
    if (answer === questions[questionIndex - 1].correct_answer) {
        feedbackElement.innerText = 'Correct! 😊';
        feedbackElement.classList.add('correct');
        score+=10;
        updateScore();
    } else {
        feedbackElement.innerText = 'Incorrect! 😞';
        feedbackElement.classList.add('incorrect');
        score-=5;
        updateScore();
    }
    feedbackElement.classList.remove('hide');
}


function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((questionIndex + 1) / questions.length) * 100; 
    progressBar.style.width = progress + '%';
}

document.getElementById('difficulty').addEventListener('change', function() {
  
    var selectedDifficulty = document.getElementById('difficulty').value;
    console.log('Selected difficulty:', selectedDifficulty); 
   
    document.getElementById('question-difficulty').innerText = selectedDifficulty;
});


function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
    localStorage.setItem('triviaScore', score); 
}