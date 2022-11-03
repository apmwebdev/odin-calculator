const add = (a, operator, b, areMixedTypes = false) => {
  if (!areMixedTypes) {
    return a + b;
  }
  
  a = formatNum(a, true);
  b = formatNum(b, true);
  
  switch (true) {
    case ((typeof a === 'number' || typeof a === 'bigint') && Array.isArray(b)):
      return `${evalInts(a, operator, b[0])}.${b[1]}`;
    case (Array.isArray(a) && (typeof b === 'number' || typeof b === 'bigint')):
      return `${evalInts(b, operator, a[0])}.${a[1]}`;
    default:
      return 'ERROR';
  }
}

const subtract = (a, operator, b, areMixedTypes = false) => {
  if (!areMixedTypes) {
    return a - b;
  }
  a = formatNum(a);
  b = formatNum(b);
  
  switch (true) {
    case (Array.isArray(b)):
      const bFloat = parseFloat(b.join('.'));
      return precisionRound(a - bFloat, b[1].length).toString();
    case (Array.isArray(a)):
      const aFloat = parseFloat(a.join('.'));
      return precisionRound(aFloat - b, a[1].length).toString();
    default:
      return 'ERROR';
  }
}

const multiply = (a, operator, b, areMixedTypes = false) => {
  if (!areMixedTypes) {
    return a * b;
  }
  a = formatNum(a);
  b = formatNum(b);
  
  switch (true) {
    case (Array.isArray(b)):
      const bFloat = b.join('.');
      return precisionRound(a * bFloat, b[1].length).toString();
    case (Array.isArray(a)):
      const aFloat = a.join('.');
      return precisionRound(aFloat * b, a[1].length).toString();
    default:
      return 'ERROR';
  }
}

const divide = (a, operator, b, areMixedTypes = false) => {
  if (!areMixedTypes) {
    return a / b;
  }
  a = formatNum(a);
  b = formatNum(b);
  
  switch (true) {
    case (Array.isArray(b)):
      const bFloat = b.join('.');
      return precisionRound(a / bFloat, 7).toString();
    case (Array.isArray(a)):
      const aFloat = a.join('.');
      return precisionRound(aFloat / b, 7).toString();
    default:
      return 'ERROR';
  }
}

const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

const evalFloats = (a, operator, b) => {
  const aArr = floatAsArray(a);
  const bArr = floatAsArray(b);
  a = parseFloat(a);
  b = parseFloat(b);
  let precision;
  if (operator === '+') {
    precision = aArr[1].length > bArr[1].length ? aArr[1].length : bArr[1].length;
  } else if (operator === '-') {
    precision = aArr[1].length > bArr[1].length ? aArr[1].length : bArr[1].length;
  } else if (operator === '×') {
    precision = aArr[1].length + bArr[1].length;
  } else {
    precision = 7;
  }
  //Converting to a string to remove trailing zeros
  return precisionRound(operate(a, operator, b), precision).toString();
}

const evalInts = (a, operator, b) => {
  a = BigInt(a);
  b = BigInt(b);
  return operate(a, operator, b);
}

const operate = (operand1, operator, operand2, areMixedTypes = false) => {
  switch (operator) {
    case '+':
      return add(operand1, operator, operand2, areMixedTypes);
    case '-':
      return subtract(operand1, operator, operand2, areMixedTypes);
    case '×':
      return multiply(operand1, operator, operand2, areMixedTypes);
    case '÷':
      return divide(operand1, operator, operand2, areMixedTypes);
    default:
      return 'ERROR';
  }
}

const evaluate = (operand1, operator, operand2) => {
  if (hasDecimal(operand1) && hasDecimal(operand2)) {
    return evalFloats(operand1, operator, operand2);
  }
  if (!hasDecimal(operand1) && !hasDecimal(operand2)) {
    return evalInts(operand1, operator, operand2);
  }
  // operand1 = formatNum(operand1);
  // operand2 = formatNum(operand2);
  return operate(operand1, operator, operand2, true);
}

const formatNum = (num, canUseBigInt = false) => {
  if (!hasDecimal(num)) {
    if (canUseBigInt) {
      return BigInt(num);
    }
    return Number(num);
  }
  let numArray = floatAsArray(num);
  if (canUseBigInt) {
    numArray[0] = BigInt(numArray[0]);
  } else {
    numArray[0] = Number(numArray[0]);
  }
  return numArray;
}

const hasDecimal = (numString) => numString.match(/\./);

const maybeAddText = (str) => {
  if (!isTextValid(str)) return;
  if (maybeDoOperation(str)) return;
  updateText(str);
}

const isValidOperation = () => {
  if (!getFullText()) return false;
  if (getFullTextAsArray().length < 3) return false;
  if (getFullTextAsArray()[2].slice(-1) === '.') return false;
  return true;
}

const isTextValid = (str) => {
  const screenText = getFullText();
  
  //Allow only numbers or a period as the first character on the screen
  if (screenText === '') return !isOperator(str);
  
  const arrayText = getFullTextAsArray();
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
    
    //Don't allow numbers >= than 10 trillion
    if (lastItemArr && lastItemArr[0].match(/\d/)) {
      if (lastItemArr[0].length > 13 && str.match(/\d/)) {
        return false;
      }
    }
    
    //Only allow up to 7 decimal places
    if (lastItemArr.length === 2) {
      const mantissa = lastItemArr[1];
      if (mantissa.length >= 7 && str.match(/\d/)) {
        return false;
      }
    }
  }
  
 return true;
}

const maybeDoOperation = (str) => {
  let screenTextContainsOperator = false;
  for (let textFragment of getFullTextAsArray()) {
    if (isOperator(textFragment)) {
      screenTextContainsOperator = true;
      break;
    }
  }
  
  if (screenTextContainsOperator && isOperator(str)) {
    updateText(evaluate(...getFullTextAsArray()) + str, true);
    return true;
  }
  return false;
}

const floatAsArray = (num) => num.split('.');

const isOperator = (input) => {
  return (input === '+' || input === '-' || input === '×' || input === '÷');
}

const getFullText = () => {
  return fullText;
}

const getFullTextAsArray = () => {
  const returnArr = getFullText().match(/(\d+(\.\d*)?|\D+)/g);
  if (Array.isArray(returnArr)) {
    return returnArr;
  }
  return [];
}

const updateText = (text = '', shouldClearText = false) => {
  let newText = fullText;
  if (shouldClearText) newText = '';
  newText += text;
  fullText = newText;
  updateCalcScreen();
}

const updateCalcScreen = () => {
  let calcText = document.querySelector('.calc-screen');
  let textArr = getFullTextAsArray();
  if (fullText === '') {
    calcText.textContent = '0';
  } else if (textArr.length) {
    calcText.textContent = textArr.pop();
  }
}

const addKeyListeners = () => {
  const keys = document.querySelectorAll('.key:not(.nontext)');
  keys.forEach(key => setKeyVal(key));
  
  document.getElementById('clear').addEventListener('click',
    () => updateText('', true));
  
  document.getElementById('equals').addEventListener('click',
    equals);
  
  document.getElementById('backspace').addEventListener('click',
    backspace);
}

const setKeyVal = (key) => {
  key.addEventListener('click', () => maybeAddText(key.textContent));
}

const equals = () => {
  if (isValidOperation()) {
    updateText(evaluate(...getFullTextAsArray()), true);
  }
  
}

const backspace = () => {
  if (getFullText()) {
    updateText(getFullText().slice(0, -1), true);
  }
}

const initCalculator = () => {
  updateText();
  addKeyListeners();
}

let fullText = '';

initCalculator();