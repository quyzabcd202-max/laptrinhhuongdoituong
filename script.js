const valueEl = document.getElementById("value");
const historyEl = document.getElementById("history");

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

function render() {
  valueEl.textContent = current;
  historyEl.textContent = previous !== null && operator ? previous + " " + operator : "";
}

function resetIfNeeded() {
  if (justEvaluated || current === "Lỗi") {
    current = "0";
    justEvaluated = false;
  }
}

function inputNumber(n) {
  resetIfNeeded();
  current = current === "0" ? n : current + n;
  if (current.length > 14) current = current.slice(0, 14);
}

function inputDot() {
  resetIfNeeded();
  if (!current.includes(".")) current += ".";
}

function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? null : a / b;
  }
}

function format(v) {
  if (v === null || !isFinite(v)) return "Lỗi";
  return String(parseFloat(v.toPrecision(12)));
}

function chooseOperator(op) {
  if (current === "Lỗi") return;
  if (operator && !justEvaluated && previous !== null) {
    current = format(calculate(parseFloat(previous), parseFloat(current), operator));
    if (current === "Lỗi") { previous = null; operator = null; return; }
  }
  previous = current;
  operator = op;
  justEvaluated = false;
  current = "0";
}

function equal() {
  if (operator === null || previous === null) return;
  current = format(calculate(parseFloat(previous), parseFloat(current), operator));
  previous = null;
  operator = null;
  justEvaluated = true;
}

function del() {
  if (justEvaluated || current === "Lỗi") { current = "0"; justEvaluated = false; return; }
  current = current.length > 1 ? current.slice(0, -1) : "0";
}

function allClear() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
}

function press(btn) {
  if (btn.dataset.num !== undefined) inputNumber(btn.dataset.num);
  else if (btn.dataset.op) chooseOperator(btn.dataset.op);
  else if (btn.dataset.action === "dot") inputDot();
  else if (btn.dataset.action === "equal") equal();
  else if (btn.dataset.action === "del") del();
  else if (btn.dataset.action === "ac") allClear();
  render();
}

document.getElementById("keys").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) press(btn);
});

// Hỗ trợ bàn phím
document.addEventListener("keydown", (e) => {
  const k = e.key;
  let sel = null;
  if (/^[0-9]$/.test(k)) sel = `[data-num="${k}"]`;
  else if (k === "+") sel = '[data-op="+"]';
  else if (k === "-") sel = '[data-op="-"]';
  else if (k === "*" || k === "x") sel = '[data-op="×"]';
  else if (k === "/" || k === ":") sel = '[data-op="÷"]';
  else if (k === "." || k === ",") sel = '[data-action="dot"]';
  else if (k === "Enter" || k === "=") sel = '[data-action="equal"]';
  else if (k === "Backspace") sel = '[data-action="del"]';
  else if (k === "Escape") sel = '[data-action="ac"]';
  if (sel) {
    e.preventDefault();
    press(document.querySelector(sel));
  }
});

render();
