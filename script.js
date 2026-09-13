let buttons = document.getElementsByClassName("btn");

let display = document.getElementById("currentDisplay");
let previousDisplay = document.getElementById("previousDisplay");

let displayData = [];

// -----------------------------------
// Theme Toggle
// -----------------------------------
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeToggle.innerText = "☀️";
  } else {
    themeToggle.innerText = "🌙";
  }
});

let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;

// -----------------------------------
// Button Click
// -----------------------------------

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", (e) => {
    let value = e.target.innerText;

    // Number
    if (!isNaN(value) || value === ".") {
      addToDisplay(value);
    }

    // Operator
    else if (
      value === "+" ||
      value === "−" ||
      value === "×" ||
      value === "÷" ||
      value === "%"
    ) {
      chooseOperator(value);
    }

    // Equal
    else if (value === "=") {
      calculate();
    }

    // Clear
    else if (value === "AC") {
      clearCalculator();
    }

    // Delete
    else if (value === "DEL") {
      deleteLast();
    }
  });
}

// -----------------------------------
// Add Number To Display
// -----------------------------------

function addToDisplay(value) {
  // If we just selected an operator,
  // start entering the second number
  if (waitingForSecondNumber) {
    displayData = [];
    waitingForSecondNumber = false;
  }

  // Prevent multiple decimal points
  if (value === ".") {
    if (displayData.includes(".")) {
      return;
    }

    // If decimal is first input
    if (displayData.length === 0) {
      displayData.push("0");
    }
  }

  // Prevent multiple leading zeros
  if (value === "0" && displayData.length === 1 && displayData[0] === "0") {
    return;
  }

  displayData.push(value);

  display.innerText = displayData.join("");

  console.log("Display:", displayData);
}

// -----------------------------------
// Choose Operator
// -----------------------------------

function chooseOperator(selectedOperator) {
  // Don't allow operator without number
  if (displayData.length === 0) {
    return;
  }

  // If user presses operator again,
  // just change the operator
  if (waitingForSecondNumber) {
    operator = selectedOperator;
    previousDisplay.innerText = `${firstNumber} ${operator}`;
    return;
  }

  firstNumber = Number(displayData.join(""));

  operator = selectedOperator;

  previousDisplay.innerText = `${firstNumber} ${operator}`;

  waitingForSecondNumber = true;

  console.log("First Number:", firstNumber);
  console.log("Operator:", operator);
}

// -----------------------------------
// Calculate
// -----------------------------------

function calculate() {
  // We need first number + operator + second number
  if (firstNumber === null || operator === null || displayData.length === 0) {
    return;
  }

  let secondNumber = Number(displayData.join(""));

  let result;

  switch (operator) {
    case "+":
      result = firstNumber + secondNumber;
      break;

    case "−":
      result = firstNumber - secondNumber;
      break;

    case "×":
      result = firstNumber * secondNumber;
      break;

    case "÷":
      if (secondNumber === 0) {
        display.innerText = "Error";
        return;
      }

      result = firstNumber / secondNumber;
      break;

    case "%":
      result = firstNumber % secondNumber;
      break;

    default:
      return;
  }

  // Remove unnecessary decimal digits
  result = Number(result.toFixed(10));

  previousDisplay.innerText = `${firstNumber} ${operator} ${secondNumber} =`;

  display.innerText = result;

  // Store result for next calculation
  displayData = String(result).split("");

  firstNumber = null;
  operator = null;
  waitingForSecondNumber = true;

  console.log("Result:", result);
}

// -----------------------------------
// Clear Calculator
// -----------------------------------

function clearCalculator() {
  displayData = [];

  firstNumber = null;

  operator = null;

  waitingForSecondNumber = false;

  display.innerText = "0";

  previousDisplay.innerText = "";
}

// -----------------------------------
// Delete Last Character
// -----------------------------------

function deleteLast() {
  // Don't delete if waiting for second number
  if (waitingForSecondNumber) {
    return;
  }

  displayData.pop();

  if (displayData.length === 0) {
    display.innerText = "0";
  } else {
    display.innerText = displayData.join("");
  }
}
