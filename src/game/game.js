import { TICK_BASE_MS, HARD_DROP_SPEED } from './constants.js';
import { clearFullLayers, occ, frozenMeshes } from './board.js';
import { randomPiece } from './piece.js';
import { setScore, setLines, setLevel } from '../ui/hud.js';

let current = null;
let score = 0, lines = 0, level = 1, tickMs = TICK_BASE_MS;
let paused = false;
let hardDropping = false;
let lastTick = performance.now();

function addScore(n){ score += n; setScore(score); }
function addLines(n){
  lines += n; setLines(lines);
  if (Math.floor(lines/5)+1 > level) {
    level = Math.floor(lines/5)+1;
    setLevel(level);
    tickMs = Math.max(120, TICK_BASE_MS - (level-1)*60);
  }
}

function spawn() {
  current = randomPiece();
  if (!current.canPlace()) {
    alert('Game Over — resetting');
    resetGame();
  }
}

export function resetGame() {
  for (let z=0; z<frozenMeshes.length; z++) {
    for (const m of frozenMeshes[z]) m.parent && m.parent.remove(m);
    frozenMeshes[z].length = 0;
    for (let x=0;x<occ.length;x++) for (let y=0;y<occ[0].length;y++) occ[x][y][z] = false;
  }
  if (current && current.removeFromScene) current.removeFromScene();
  current = randomPiece();
  score = 0; lines = 0; level = 1; tickMs = TICK_BASE_MS; hardDropping=false; paused=false;
  setScore(0); setLines(0); setLevel(1);
}

export function onKey(key){
  if (!current) return;
  switch (key) {
    case 'a': case 'A':   current.move(-1,0,0); break;
    case 'd': case 'D':   current.move(1,0,0);  break;
    case 'w': case 'W':   current.move(0,1,0);  break;
    case 's': case 'S':  current.move(0,-1,0); break;
    case ' ':          if (!hardDropping) hardDropping = true; break;

    case 'q': case 'Q': current.tryRotate('x', +1); break;
    case 'e': case 'E': current.tryRotate('y', +1); break;
    case 'x': case 'X': current.tryRotate('z', +1); break;

    case 'p': case 'P': paused = !paused; break;
    case 'r': case 'R': resetGame(); break;
  }
}

export function startGame() {
  spawn();
  setScore(0); setLines(0); setLevel(1);
}

export function update(dt) {
  if (!current || paused) return;
  if (hardDropping) {
    for (let i=0;i<10;i++) {
      if (!current.move(0,0,-1)) {
        current.freeze();
        clearFullLayers(addLines, addScore);
        spawn();
        hardDropping = false;
        break;
      }
    }
    return;
  }
  if (dt - lastTick >= tickMs) {
    lastTick = dt;
    if (!current.move(0,0,-1)) {
      current.freeze();
      clearFullLayers(addLines, addScore);
      spawn();
    }
  }
}
