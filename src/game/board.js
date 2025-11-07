import { scene } from '../core/scene.js';
import { GRID_X, GRID_Y, GRID_Z } from './constants.js';

export const occ = new Array(GRID_X).fill().map(
  _ => new Array(GRID_Y).fill().map(__ => new Array(GRID_Z).fill(false))
);

export const frozenMeshes = new Array(GRID_Z).fill().map(() => []);

export function clearFullLayers(addLines, addScore) {
  const full = new Array(GRID_Z).fill(false);
  let cleared = 0;
  for (let z = 0; z < GRID_Z; z++) {
    let isFull = true;
    outer: for (let x = 0; x < GRID_X; x++) {
      for (let y = 0; y < GRID_Y; y++) {
        if (!occ[x][y][z]) { isFull = false; break outer; }
      }
    }
    full[z] = isFull;
    if (isFull) cleared++;
  }
  if (cleared === 0) return;

  const clearedBelow = new Array(GRID_Z).fill(0);
  let run = 0;
  for (let z = 0; z < GRID_Z; z++) {
    clearedBelow[z] = run;
    if (full[z]) run++;
  }

  const newOcc = new Array(GRID_X).fill().map(
    _ => new Array(GRID_Y).fill().map(__ => new Array(GRID_Z).fill(false))
  );
  for (let x = 0; x < GRID_X; x++) {
    for (let y = 0; y < GRID_Y; y++) {
      for (let z = 0; z < GRID_Z; z++) {
        if (!occ[x][y][z]) continue;
        if (full[z]) continue;
        const nz = z - clearedBelow[z];
        newOcc[x][y][nz] = true;
      }
    }
  }

  const newFrozen = new Array(GRID_Z).fill().map(() => []);
  for (let z = 0; z < GRID_Z; z++) {
    if (full[z]) {
      for (const m of frozenMeshes[z]) { scene.remove(m); }
      continue;
    }
    const shift = clearedBelow[z];
    const targetZ = z - shift;
    for (const m of frozenMeshes[z]) {
      m.position.z -= shift;
      newFrozen[targetZ].push(m);
    }
  }

  for (let x = 0; x < GRID_X; x++)
    for (let y = 0; y < GRID_Y; y++)
      for (let z = 0; z < GRID_Z; z++)
        occ[x][y][z] = newOcc[x][y][z];

  for (let z = 0; z < GRID_Z; z++) {
    frozenMeshes[z].length = 0;
    Array.prototype.push.apply(frozenMeshes[z], newFrozen[z]);
  }

  addLines(cleared);
  addScore(cleared * 100);
}
