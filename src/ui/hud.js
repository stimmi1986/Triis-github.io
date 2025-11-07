const scoreEl = document.getElementById('score');
const linesEl = document.getElementById('lines');
const levelEl = document.getElementById('level');

export function setScore(v){ scoreEl.textContent = String(v); }
export function setLines(v){ linesEl.textContent = String(v); }
export function setLevel(v){ levelEl.textContent = String(v); }
