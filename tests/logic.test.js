import assert from 'node:assert/strict';
import { applyRotations, makeOcc, clearFullLayersPure, canPlaceCells } from '../src/game/logic.js';

const asSet = (cells) => new Set(cells.map(c=>c.join(',')));

// 1) rotation preserves cell count and integer coords
{
  const base = [[0,0,0],[1,0,0],[2,0,0]];
  const r = applyRotations(base, 1,2,3);
  assert.equal(r.length, 3);
  for (const [x,y,z] of r) assert.equal(Number.isInteger(x)&&Number.isInteger(y)&&Number.isInteger(z), true);
}

// 2) inverse rotation (Z^-2 → Y^-3 → X^-1) restores original
{
  const base = [[0,0,0],[1,0,0],[0,1,0]];
  const r = applyRotations(base, 1,3,2);
  const undoZ = applyRotations(r, 0, 0, -2);
  const undoY = applyRotations(undoZ, 0, -3, 0);
  const back  = applyRotations(undoY, -1, 0, 0);
  const s1 = asSet(base), s2 = asSet(back);
  for (const c of s1) assert.ok(s2.has(c));
}

// 3) bounds & collisions
{
  const occ = makeOcc(3,3,3,false);
  occ[1][0][0] = true;
  const base = [[0,0,0],[1,0,0],[2,0,0]];
  assert.equal(canPlaceCells(occ, base, 0,0,0), false);
  assert.equal(canPlaceCells(occ, base, 0,1,0), true);
}

// 4) layer clearing moves everything down
{
  const occ = makeOcc(3,3,4,false);
  for (let x=0;x<3;x++) for (let y=0;y<3;y++) occ[x][y][1] = true;
  occ[0][0][3] = true;
  const { cleared, occ: out } = clearFullLayersPure(occ);
  assert.equal(cleared, 1);
  assert.equal(out[0][0][2], true);
  for (let x=0;x<3;x++) for (let y=0;y<3;y++) assert.equal(out[x][y][3], false);
}

console.log('All logic tests passed ✔');
