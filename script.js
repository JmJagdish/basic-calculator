const buttons = document.querySelectorAll(".btn");
const display = document.getElementById("currentDisplay");
const previousDisplay = document.getElementById("previousDisplay");
const themeToggle = document.getElementById("themeToggle");

let currentValue = "0";
let firstNumber = null;
let operator = null;
let shouldResetDisplay = false;

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
});

buttons.forEach((button) => {
  button.addEventListener("click", () => handleInput(button.dataset.action));
});

document.addEventListener("keydown", (event) => {
  const keyMap = {
    "+": "+", "-": "−", "*": "×", "/": "÷", "%": "%",
    Enter: "=", "=": "=", Escape: "AC", Backspace: "DEL",
  };
  const action = /^[0-9.]$/.test(event.key) ? event.key : keyMap[event.key];
  if (action) {
    event.preventDefault();
    handleInput(action);
  }
});

function handleInput(action) {
  if (/^[0-9.]$/.test(action)) inputDigit(action);
  else if (["+", "−", "×", "÷", "%"].includes(action)) selectOperator(action);
  else if (action === "=") calculate();
  else if (action === "AC") clearCalculator();
  else if (action === "DEL") deleteLast();
}

function inputDigit(digit) {
  if (currentValue === "Error" || shouldResetDisplay) {
    currentValue = "0";
    shouldResetDisplay = false;
  }

  if (digit === ".") {
    if (currentValue.includes(".")) return;
    currentValue += ".";
  } else if (currentValue === "0") {
    currentValue = digit;
  } else {
    currentValue += digit;
  }
  updateDisplay();
}

function selectOperator(selectedOperator) {
  if (currentValue === "Error") return;
  const inputNumber = Number(currentValue);

  // Evaluate pending operations first, so chained calculations behave predictably.
  if (operator && !shouldResetDisplay) {
    const result = performCalculation(firstNumber, inputNumber, operator);
    if (result === null) return;
    currentValue = formatResult(result);
    firstNumber = result;
  } else if (firstNumber === null) {
    firstNumber = inputNumber;
  }

  operator = selectedOperator;
  shouldResetDisplay = true;
  previousDisplay.textContent = `${formatResult(firstNumber)} ${operator}`;
  updateDisplay();
}

function calculate() {
  if (!operator || shouldResetDisplay || currentValue === "Error") return;
  const secondNumber = Number(currentValue);
  const result = performCalculation(firstNumber, secondNumber, operator);
  if (result === null) return;

  previousDisplay.textContent = `${formatResult(firstNumber)} ${operator} ${formatResult(secondNumber)} =`;
  currentValue = formatResult(result);
  firstNumber = null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function performCalculation(left, right, selectedOperator) {
  if ((selectedOperator === "÷" || selectedOperator === "%") && right === 0) {
    showError("Cannot divide by zero");
    return null;
  }

  let result;
  switch (selectedOperator) {
    case "+": result = left + right; break;
    case "−": result = left - right; break;
    case "×": result = left * right; break;
    case "÷": result = left / right; break;
    case "%": result = left % right; break;
    default: return null;
  }
  if (!Number.isFinite(result)) {
    showError("Result is too large");
    return null;
  }
  return result;
}

function formatResult(value) {
  // Remove floating-point tails without truncating valid results.
  return String(Number(value.toPrecision(12)));
}

function showError(message) {
  currentValue = "Error";
  firstNumber = null;
  operator = null;
  shouldResetDisplay = true;
  previousDisplay.textContent = message;
  updateDisplay();
}

function clearCalculator() {
  currentValue = "0";
  firstNumber = null;
  operator = null;
  shouldResetDisplay = false;
  previousDisplay.textContent = "";
  updateDisplay();
}

function deleteLast() {
  if (shouldResetDisplay || currentValue === "Error") return;
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
  if (currentValue === "-" || currentValue === "") currentValue = "0";
  updateDisplay();
}

function updateDisplay() {
  display.textContent = currentValue;
}
