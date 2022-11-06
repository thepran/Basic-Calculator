const keys = document.querySelector(".calculator-keys");

let expression = "";
let numbers = [""]; //holds array of inputs by users
let result = null;
window.addEventListener('load', () => {

  const unloadEl = document.querySelector(".unload");

  unloadEl.style.display = "none";

  keys.addEventListener("click", (e) => {
    if (e.target.matches("button")) {
      evaluateExpression(e.target);
    }
  });

  document.addEventListener("keydown", (e) => {
    e.preventDefault();

    //Filters all the valid keyboard inputs and assign properties to them
    if (
      /[\d/\*\-\+\%\.\=]/.test(e.key) ||
      e.key === "Enter" ||
      e.key === "Backspace" ||
      e.key === "Delete"
    ) {
      if (/[\d]/.test(e.key)) {
        e = {
          dataset: {
            action: "number",
            face: e.key,
          },
          value: e.key,
        };
      } else if (e.key === ".") {
        e = {
          dataset: {
            action: "decimal",
            face: ".",
          },
          value: e.key,
        };
      } else if (e.key === "%") {
        e = {
          dataset: {
            action: "percent",
            face: e.key,
          },
          value: "/100",
        };
      } else if (e.key === "/") {
        e = {
          dataset: {
            action: "operator",
            face: "&#xF7;",
          },
          value: e.key,
        };
      } else if (e.key === "*") {
        e = {
          dataset: {
            action: "operator",
            face: "&#215;",
          },
          value: e.key,
        };
      } else if (e.key === "=" || e.key == "Enter") {
        e = {
          dataset: {
            action: "equals",
          },
        };
      } else if (e.key === "Backspace") {
        e = {
          dataset: {
            action: "back",
          },
        };
      } else if (e.key === "Delete") {
        e = {
          dataset: {
            action: "clear",
          },
        };
      } else {
        e = {
          dataset: {
            action: "operator",
            face: e.key,
          },
          value: e.key,
        };
      }
      evaluateExpression(e);
    }
  });
});

/**********************Funtion To Display on Screen ********************************** */

function inputDisplay(equation, result) {
  const inputEl = document.querySelector(".display .input");
  const resultEl = document.querySelector(".display #result");
  inputEl.innerHTML = equation ? equation : '0';
  resultEl.textContent = result;

  resultEl.textContent = result
}
/*********************************************************************************** */

/************************************************************************************** */

//This function will arrange the users inputs in proper expression that can futher be evaluated.

const evaluateExpression = (key) => {
  /**------------------------------------------------------- */
  if (key.dataset.action === "number") {
    if (numbers.length && !expression) numbers = [""]; //reset numbers array if expression and array do not match.

    if (/[\%+\-\/\*\÷\×]/.test(numbers[numbers.length - 1])) {
      if (numbers[numbers.length - 1] === "%") expression += "*";
      numbers.push("");
    }
    numbers[numbers.length - 1] += key.value;
    expression += key.value;
    result = evalResult(expression);
  }
  /**------------------------------------------------------------ */
  else if (key.dataset.action === "percent") {
    //
    expression += key.value;
    result = evalResult(expression);
    numbers.push(key.dataset.face);
    input = "";
  }
  /**------------------------------------------------------------ */
  else if (key.dataset.action === "decimal") {
    if (numbers.length && !expression) numbers = [""];

    if (!numbers[numbers.length - 1].includes(".")) {
      numbers[numbers.length - 1] += key.dataset.face;
      expression += key.value;
    }
  }
  /**--------------------------------------- */
  else if (key.dataset.action === "operator") {
    if (!expression && numbers[0]) expression = numbers[0];

    switch (key.value) {
      case "-":
        if (/[+\-]/.test(expression[expression.length - 1])) {
          // Flips (+ -) sign
          expression = expression.replace(
            expression[expression.length - 1],
            key.value
          );
          numbers[numbers.length - 1] = key.dataset.face;
        } else {
          expression += key.value;
          numbers.push(key.dataset.face);
        }
        break;

      case "+":
      case "/":
      case "*":
        if (expression) {
          if (/[+\*\/\-]/.test(expression[expression.length - 1])) {
            expression = expression.replace(
              expression[expression.length - 1],
              key.value
            );
            numbers[numbers.length - 1] = key.dataset.face;
          } else {
            expression += key.value;
            numbers.push(key.dataset.face);
          }
          break;
        }
    }
  } else if (key.dataset.action === "clear") clearAll();
  else if (key.dataset.action === "equals") evaluate();
  else backSpace();

  inputDisplay(numbers.join(""), result); // calling a function to display the inputs
};

/*********************************************************************************** */

/************************************************************************************** */
const evalResult = (expression) => {
  let result;
  try {
    result = Math.round(new Function("return " + expression)() * 10000) / 10000;
    if (result === Infinity) throw "Can't Divide by 0";
    else if (isNaN(result)) throw "NaN";
    return result;
  }
  catch (error) {

    return error === "Can't Divide by 0" ? error : error === "NaN" ? "" : "Format Error";

  }


};
/*************************************************************************************** */

/*************************************************************************************** */
const clearAll = () => {
  expression = "";
  result = null;
  numbers = [""];
};
/*************************************************************************************** */

/*************************************************************************************** */
const evaluate = () => {
  expression = !expression ? numbers[0] : expression;
  result = evalResult(expression);
  numbers = isNaN(result) ? [""] : [String(result)];
  expression = "";
  result = null;
};
/*************************************************************************************** */

/*************************************************************************************** */
const backSpace = () => {
  if (/[\+\-\×\÷]/.test(numbers[numbers.length - 1])) {
    //When numbers[] last digit is operator
    expression = expression.slice(0, -1);
    numbers.pop();
  } else if (numbers[numbers.length - 1] === "%") {
    expression = expression.slice(0, -4);
    numbers.pop();
  } else {
    if (numbers[numbers.length - 1].length === 1) {
      expression = expression.slice(0, -1);
      numbers.pop();
      if (numbers.length === 0) numbers.push("");
    } else {
      expression = expression.slice(0, -1);
      numbers[numbers.length - 1] = numbers[numbers.length - 1].slice(0, -1);
    }
  }

  result = /[\+\-\*\/]/.test(expression[expression.length - 1])
    ? evalResult(expression.slice(0, -1))
    : evalResult(expression);
};
/*************************************************************************************** */
