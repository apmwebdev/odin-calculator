const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const operate = (operand1, operator, operand2) => {
  operand1 = Number(operand1);
  operand2 = Number(operand2);
  
  switch (operator) {
    case '+':
      return add(operand1, operand2);
    case '-':
      return subtract(operand1, operand2);
    case '×':
      return multiply(operand1, operand2);
    case '÷':
      return divide(operand1, operand2);
    default:
      return 'ERROR';
  }
}

const formatNum = (num) => {
  if (!hasDecimal(num)) {
    if (num.length > 5) return BigInt(num);
    return Number(num);
  }
  let numArray = floatAsArray(num);
  if (numArray[0]) {
    return false;
  }
}

const hasDecimal = (numString) => numString.match(/\./);
const maybeUseBigInt = (num) => num.length > 5 ? BigInt(num) : false;

const maybeAddText = (str) => {
  if (!isTextValid(str)) return;
  if (maybeDoOperation(str)) return;
  updateScreen(str);
}

const isValidOperation = () => {
  if (!getScreenTextAsArray().length) return false;
  if (getScreenTextAsArray().length < 3) return false;
  return true;
}

const isTextValid = (str) => {
  const screenText = getScreenText();
  
  //Allow only numbers or a period as the first character on the screen
  if (screenText === '') return !isOperator(str);
  
  const arrayText = getScreenTextAsArray();
  const lastItem = arrayText[arrayText.length - 1];
  
  //Don't allow leading zeroes except for floats
  if (lastItem === '0' && str !== '.') {
    return false;
  }
  
  //Don't allow multiple periods in one operand
  if (lastItem.match(/\./) && str === '.') {
    return false;
  }
  
  //Don't allow periods at the end of operands
  if (lastItem.slice(-1) === '.' && !str.match(/\d/)) {
    return false;
  }
  
  //Don't allow multiple operators in a row
  if (isOperator(lastItem) && isOperator(str)) {
    return false;
  }
  
  //Validate number lengths
  if (!isOperator(lastItem)) {
    const lastItemArr = floatAsArray(lastItem);
    
    //Don't allow numbers larger than a trillion
    if (lastItemArr && lastItemArr[0].match(/\d/)) {
      if (lastItemArr[0].length >= 13 && str.match(/\d/)) {
        return false;
      }
    }
    
    //Only allow up to 7 decimal places
    if (lastItemArr.length === 3) {
      const mantissa = lastItemArr[2];
      if (mantissa.length >= 7 && str.match(/\d/)) {
        return false;
      }
    }
    // console.log(lastItemArr);
  }
  
 return true;
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
   * resulting substrings into an array.
   */
  const returnArr = getScreenText().match(/(\d+(\.\d*)?|\D+)/g);
  if (Array.isArray(returnArr)) {
    return returnArr;
  }
  return [];
}

const floatAsArray = (num) => num.match(/\d+|\./g);

const isOperator = (input) => {
  return (input === '+' || input === '-' || input === '×' || input === '÷');
}

const updateScreen = (text = '', shouldClearScreen = false) => {
  let screenText = document.querySelector('.calc-screen').textContent;
  if (shouldClearScreen) screenText = '';
  screenText += text;
  document.querySelector('.calc-screen').textContent = screenText;
  console.log(getScreenTextAsArray());
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
  if (isValidOperation) {
    updateScreen(operate(...getScreenTextAsArray()), true);
  }
  
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