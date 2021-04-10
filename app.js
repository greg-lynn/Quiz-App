const STORE = {
  // 5 or more questions are required
  questions: [
    {
      question: 'What year did the United States of America gain independence?',
      answers: [
        '1793',
        '1776',
        '1803',
        '2020'
      ],
      correctAnswer: '1776'
    },
    {
      question: 'What year did France gain Independence?',
      answers: [
        '1789',
        '1901',
        '1843',
        '1794'
      ],
      correctAnswer: '1789'
    },
    {
      question: 'Who was the President of The United States before Donald Trump?',
      answers: [
        'Bill Clinton',
        'Barack Obama',
        'George W. Bush',
        'Jeff Bezos'
      ],
      correctAnswer: 'Barack Obama'
    },
    {
      question: 'How many states are in the USA?',
      answers: [
        '48',
        '51',
        '53',
        '50'
      ],
      correctAnswer: '50'
    },
    {
      question: 'Which country endured the Potato Famine in the mid 1800s?',
      answers: [
        'Germany',
        'Netherlands',
        'Northern Ireland',
        'Ireland'
      ],
      correctAnswer: 'Ireland'
    },
  ],
  quizStarted: false,
  currentQuestion: 0,
  score: 0
};

//Produces HTML for beginning screen

function generateStartScreenHtml() {
  return `
    <div class="start-screen">
      <p>This quiz will assess your basic knowledge of World History.</p>
      <button type="button" id="start">Start Quiz</button>
    </div>`;
}

//Generates the HTML for the section of the app that displays the question number and the score

function generateQuestionNumberAndScoreHtml() {
  return `
    <ul class="question-and-score">
      <li id="question-number">
        Question Number: ${STORE.currentQuestion + 1}/${STORE.questions.length}
      </li>
      <li id="score">
        Score: ${STORE.score}/${STORE.questions.length}
      </li>
    </ul>`;
}

//Creates list of possible answers

function generateAnswersHtml() {
  const answersArray = STORE.questions[STORE.currentQuestion].answers
  let answersHtml = '';
  let i = 0;

  answersArray.forEach(answer => {
    answersHtml += `
      <div id="option-container-${i}">
        <input type="radio" name="options" id="option${i + 1}" value= "${answer}" tabindex ="${i + 1}" required> 
        <label for="option${i + 1}"> ${answer}</label>
      </div>
    `;
    i++;
  });
  return answersHtml;
}

//Tells the HTML to display one question

function generateQuestionHtml() {
  let currentQuestion = STORE.questions[STORE.currentQuestion];
  return `
    <form id="question-form" class="question-form">
      <fieldset>
        <div class="question">
          <legend> ${currentQuestion.question}</legend>
        </div>
        <div class="options">
          <div class="answers">
            ${generateAnswersHtml()}
          </div>
        </div>
        <button type="submit" id="submit-answer-btn" tabindex="5">Submit</button>
        <button type="button" id="next-question-btn" tabindex="6"> Next &gt;></button>
      </fieldset>
    </form >
  `;
}

//A function that shows the HTML for results screen
function generateResultsScreen() {
  return `
    <div class="results">
      <form id="js-restart-quiz">
        <fieldset>
          <div class="row">
            <div class="col-12">
              <legend>Your Score is: ${STORE.score}/${STORE.questions.length}</legend>
            </div>
          </div>
        
          <div class="row">
            <div class="col-12">
              <button type="button" id="restart"> Restart Quiz </button>
            </div>
          </div>
        </fieldset>
    </form>
    </div>
  `;
}

//HTML gives user feedback about if their answer was right.
function generateFeedbackHTML(answerStatus) {
  let correctAnswer = STORE.questions[STORE.currentQuestion].correctAnswer;
  let html = '';
  if (answerStatus === 'correct') {
    html = `
    <div class="right-answer">That is correct!</div>
    `;
  }
  else if (answerStatus === 'incorrect') {
    html = `
      <div class="wrong-answer">That is incorrect. The correct answer is ${correctAnswer}.</div>
    `;
  }
  return html;
}

/********** RENDER FUNCTION **********/

function render() {
  let html = '';

  if (STORE.quizStarted === false) {
    $('main').html(generateStartScreenHtml());
    return;
  }
  else if (STORE.currentQuestion >= 0 && STORE.currentQuestion < STORE.questions.length) {
    html = generateQuestionNumberAndScoreHtml();
    html += generateQuestionHtml();
    $('main').html(html);
  }
  else {
    $('main').html(generateResultsScreen());
  }
}

/********** EVENT HANDLER FUNCTIONS **********/

//This function handles the click of the start button
function handleStartClick() {
  $('main').on('click', '#start', function (event) {
    STORE.quizStarted = true;
    render();
  });
}

//Handles click of the next button
function handleNextQuestionClick() {
  $('body').on('click', '#next-question-btn', (event) => {
    render();
  });
}

//Handles submission of the question form
function handleQuestionFormSubmission() {
  $('body').on('submit', '#question-form', function (event) {
    event.preventDefault();
    const currentQuestion = STORE.questions[STORE.currentQuestion];

// get value from checkbox checked by user
    let selectedOption = $('input[name=options]:checked').val();

    let optionContainerId = `#option-container-${currentQuestion.answers.findIndex(i => i === selectedOption)}`;

    if (selectedOption === currentQuestion.correctAnswer) {
      STORE.score++;
      $(optionContainerId).append(generateFeedbackHTML('correct'));
    }
    else {
      $(optionContainerId).append(generateFeedbackHTML('incorrect'));
    }
    STORE.currentQuestion++;
    // hides submit button
    $('#submit-answer-btn').hide();
    // disabled inputs
    $('input[type=radio]').each(() => {
      $('input[type=radio]').attr('disabled', true);
    });
    // shows next button
    $('#next-question-btn').show();

  });
}

//Reset values for restart
function restartQuiz() {
  STORE.quizStarted = false;
  STORE.currentQuestion = 0;
  STORE.score = 0;
}

function handleRestartButtonClick() {
  $('body').on('click', '#restart', () => {
    restartQuiz();
    render();
  });
}

function handleQuizApp() {
  render();
  handleStartClick();
  handleNextQuestionClick();
  handleQuestionFormSubmission();
  handleRestartButtonClick();
}

$(handleQuizApp);
