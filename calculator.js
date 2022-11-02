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
    case '*':
      return calc.multiply(a, b);
    case '/':
      return calc.divide(a, b);
    default:
      return 'ERROR';
  }
}

calc.init = () => {
  //do stuff
}

calc.init();