const wordEl = document.getElementById('word');
const wrongLettersEL = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const spanInput = document.getElementById('span-input');

const figureParts = document.querySelectorAll('.figure-part');
let words = [];
let selectedWord = '';
let gameOver = false;

fetch('https://random-word-api.herokuapp.com/word?number=10')
  .then((res) => res.json())
  .then((data) => {
    words = data;
    selectedWord = words[Math.floor(Math.random() * words.length)];
    displayWord();
  });

// selectedWord = words[Math.floor(Math.random() * words.length)];

const correctLetters = [];
const wrongLetters = [];

//Opens the keyboard onclick of span for mobile user
function openKeyboard() {
  spanInput.focus();
}

//Show Hidden Word
function displayWord() {
  wordEl.innerHTML = `
    ${selectedWord
      .split('')
      .map(
        (letter) => `
        <span class = "letter" onclick = "openKeyboard()" >
        ${correctLetters.includes(letter) ? letter : ''}
        </span>
        `
      )
      .join('')}
`;
  const innerWord = wordEl.innerText.replace(/\n/g, '');

  if (innerWord.length > 0 && innerWord == selectedWord) {
    finalMessage.innerText = 'Congratulations! You Won! 🥳';
    popup.style.display = 'flex';
    gameOver = true;
  }
}

// update the wrong letters

function updateWrongLettersEl() {
  //display wrong letters
  wrongLettersEL.innerHTML = `
    ${wrongLetters.length > 0 ? '<p> Wrong </p>' : ''}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
    `;

  //display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'none';
    }
  });

  // check if lost
  if (wrongLetters.length == figureParts.length) {
    finalMessage.innerText = `Unfortunately You Lost. ☹️ \n Word is `;
    popup.style.display = 'flex';

    let lastChild = document.createElement('span');
    lastChild.innerText = `${selectedWord}`;
    lastChild.style.color = 'ghostwhite';
    lastChild.style.fontSize = '1.3em';
    finalMessage.appendChild(lastChild);
    gameOver = true;
  }
}

// Show notification
function ShowNotification() {
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

//  Keydown letter press
window.addEventListener('keyup', (e) => {
  const charString = spanInput.value;
  let lastChar = e.key.length === 1 ? e.key : charString[charString.length - 1];
  // charString.length > 0 ? charString[charString.length - 1] : e.key;
  lastChar = lastChar.toUpperCase();
  const finalCode = lastChar.charCodeAt(0);

  //   const finalCode = +code ? code : e.keyCode;

  console.log('keycode', finalCode, lastChar);

  if (!gameOver && finalCode >= 65 && finalCode <= 90) {
    const letter = lastChar;

    selectedWord = selectedWord.toUpperCase();

    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);

        displayWord();
      } else {
        ShowNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);

        updateWrongLettersEl();
      } else {
        ShowNotification();
      }
    }
  }
});

// restart game and play again
playAgainBtn.addEventListener('click', () => {
  spanInput.value = '';
  gameOver = false;
  //Empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];

  updateWrongLettersEl();
  displayWord();

  popup.style.display = 'none';
});

displayWord();
