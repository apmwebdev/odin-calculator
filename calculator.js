const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const operate = (a, operator, b) => {
  a = Number(a);
  b = Number(b);
  
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '×':
      return multiply(a, b);
    case '÷':
      return divide(a, b);
    default:
      return 'ERROR';
  }
}

const maybeAddText = (str) => {
  if (!isTextValid(str)) return;
  if (maybeDoOperation(str)) return;
  updateScreen(str);
}

const isTextValid = (str) => {
  const screenText = getScreenText();
  if (screenText === '') return true;
  
  const arrayText = getScreenTextAsArray();
  const lastItem = arrayText[arrayText.length - 1];
  
  if (lastItem.match(/\./) && str === '.') return false;
  
  return !(isOperator(lastItem) && isOperator(str));
}

const maybeDoOperation = (str) => {
  let screenTextContainsOperator = false;
  for (let textFragment of getScreenTextAsArray()) {
    if (isOperator(textFragment)) {
      screenTextContainsOperator = true;
      break;
    }
  }
  
  if (screenTextContainsOperator && isOperator(str)) {
    updateScreen(operate(...getScreenTextAsArray()) + str, true);
    return true;
  }
  return false;
}

const getScreenText = () =>
  document.querySelector('.calc-screen').textContent.toString();

const getScreenTextAsArray = () => {
  /**
   * Split out the screen text into operands and operators and put the
   * substrings into an array.
   */
  const returnArr = getScreenText().match(/(\d+(\.\d*)?|\D+)/g);
  if (Array.isArray(returnArr)) {
    return returnArr;
  }
  return [];
}

const isOperator = (input) => {
  return (input === '+' || input === '-' || input === '×' || input === '÷');
}

const updateScreen = (text = '', shouldClearScreen = false) => {
  let screenText = document.querySelector('.calc-screen').textContent;
  if (shouldClearScreen) screenText = '';
  screenText += text;
  document.querySelector('.calc-screen').textContent = screenText;
  // console.log(getScreenTextAsArray());
}

const addKeyListeners = () => {
  const keys = document.querySelectorAll('.key:not(.nontext)');
  keys.forEach(key => setKeyVal(key));
  
  document.getElementById('clear').addEventListener('click',
    () => updateScreen('', true));
  
  document.getElementById('equals').addEventListener('click',
    equals);
  
  document.getElementById('backspace').addEventListener('click',
    backspace);
}

const setKeyVal = (key) => {
  key.addEventListener('click', () => maybeAddText(key.textContent));
}

const equals = () => {
  updateScreen(operate(...getScreenTextAsArray()), true);
}

const backspace = () => {
  if (getScreenText()) {
    updateScreen(getScreenText().slice(0, -1), true);
  }
}

const initCalculator = () => {
  updateScreen();
  addKeyListeners();
}

initCalculator();