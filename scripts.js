// Select elements
const questionContainer = document.getElementById('question-container');
const questionEl = document.getElementById('question');
const promptEl = document.getElementById('prompt');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const message = document.getElementById('message');
const buttons = document.getElementById('buttons');

// Define questions and prompts
const questions = [
  {
    question: 'Hey there!',
    prompt: 'I have something to ask you...',
    animation: 'fadeInDown',
  },
  {
    question: 'Will you go out with me?',
    prompt: '',
    animation: 'bounceIn',
  },
  {
    question: 'Do you know how amazing you are?',
    prompt: '',
    animation: 'slideInLeft',
  },
  {
    question: 'Can I be the reason you smile today?',
    prompt: '',
    animation: 'slideInRight',
  },
  {
    question: 'Shall we make some unforgettable memories together?',
    prompt: '',
    animation: 'fadeInUp',
  },
];

// Keep track of current question index
let currentQuestion = 0;

// Function to set question and prompt with animation
function setQuestion(index) {
  const q = questions[index];
  questionEl.textContent = q.question;
  promptEl.textContent = q.prompt;

  // Apply animation classes
  questionEl.style.animation = `${q.animation} 1s ease-in-out`;
  promptEl.style.animation = `${q.animation} 1s ease-in-out`;
}

// Initial setup
setQuestion(currentQuestion);

// Function to move the No button to a random position within the container
function moveButton() {
  const containerRect = buttons.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = containerRect.width - btnRect.width;
  const maxY = containerRect.height - btnRect.height;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  noBtn.style.position = 'absolute';
  noBtn.style.left = randomX + 'px';
  noBtn.style.top = randomY + 'px';
}

// Event listener for Yes button
yesBtn.addEventListener('click', () => {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    setQuestion(currentQuestion);

    // Reset animations
    setTimeout(() => {
      questionEl.style.animation = '';
      promptEl.style.animation = '';
    }, 1000);
  } else {
    // Show the final message
    message.style.display = 'block';
    questionContainer.style.display = 'none';

    // Optional: Add confetti animation when she clicks "Yes"
    startConfetti();
  }
});

// Event listener for No button hover
noBtn.addEventListener('mouseover', moveButton);
noBtn.addEventListener('click', moveButton); // In case she manages to click, it still moves

/* Optional Confetti Effect */
function startConfetti() {
  // Use Canvas Confetti library
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}

/* Include the Canvas Confetti library */
// You can include the library via CDN in your HTML file:
// <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
