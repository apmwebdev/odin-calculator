let calc = {};

calc.add = (a, b) => a + b;
calc.subtract = (a, b) => a - b;
calc.multiply = (a, b) => a * b;
calc.divide = (a, b) => a / b;

calc.operate = (a, b, operator) => {
  switch (operator) {
    case '+':
      return calc.add(a, b);
    case '-':
      return calc.subtract(a, b);
    case '×':
      return calc.multiply(a, b);
    case '÷':
      return calc.divide(a, b);
    default:
      return 'ERROR';
  }
}

calc.addText = (str) => {
  calc.screenText += str;
  calc.updateScreen();
}

calc.clear = () => {
  calc.screenText = '';
  calc.updateScreen();
}

calc.updateScreen = () => {
  document.querySelector('.calc-screen').textContent = calc.screenText;
}

calc.screenText = '';

calc.addKeyListeners = () => {
  const keys = document.querySelectorAll('.key:not(.nontext)');
  keys.forEach(key => calc.setKeyVal(key));
  
  document.getElementById('clear').addEventListener('click',
    calc.clear);
}

calc.setKeyVal = (key) => {
  key.addEventListener('click', () => calc.addText(key.textContent));
}

calc.init = () => {
  calc.addKeyListeners();
}

calc.init();