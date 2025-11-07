import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { GRID_X, GRID_Y, GRID_Z, CUBE } from './constants.js';
import { occ, frozenMeshes } from './board.js';
import { applyRotations } from './logic.js';

export const SHAPES = [
  { name: 'I3', cells: [[0,0,0],[1,0,0],[2,0,0]] },
  { name: 'L3', cells: [[0,0,0],[1,0,0],[0,1,0]] },
];

const cubeGeo = new THREE.BoxGeometry(CUBE*0.98, CUBE*0.98, CUBE*0.98);
const cubeMatFalling = new THREE.MeshStandardMaterial({ color: 0x50fa7b, metalness: 0.1, roughness: 0.4 });
const cubeMatFrozen  = new THREE.MeshStandardMaterial({ color: 0xbfbfd4, metalness: 0.0, roughness: 0.9 });

export class Piece {
  constructor(shape) {
    this.name = shape.name;
    this.base = shape.cells;
    this.rx = this.ry = this.rz = 0;
    this.pos = { x: Math.floor(GRID_X/2)-1, y: Math.floor(GRID_Y/2)-1, z: GRID_Z-1 };
    this.meshes = shape.cells.map(()=>new THREE.Mesh(cubeGeo, cubeMatFalling));
    this.meshes.forEach(m => scene.add(m));
    this.sync();
  }

  rotatedCells() { return applyRotations(this.base, this.rx, this.ry, this.rz); }

  worldCells(nx=this.pos.x, ny=this.pos.y, nz=this.pos.z) {
    return this.rotatedCells().map(([dx,dy,dz]) => [nx+dx, ny+dy, nz+dz]);
  }

  canPlace(nx=this.pos.x, ny=this.pos.y, nz=this.pos.z) {
    const cells = this.worldCells(nx,ny,nz);
    return cells.every(([x,y,z]) =>
      x>=0 && x<GRID_X && y>=0 && y<GRID_Y && z>=0 && z<GRID_Z && !occ[x][y][z]);
  }

  move(dx,dy,dz) {
    const nx = this.pos.x+dx, ny = this.pos.y+dy, nz = this.pos.z+dz;
    if (this.canPlace(nx,ny,nz)) { this.pos = {x:nx,y:ny,z:nz}; this.sync(); return true; }
    return false;
  }

  tryRotate(axis, dir) {
    const prev = { rx:this.rx, ry:this.ry, rz:this.rz };
    if (axis==='x') this.rx += dir;
    if (axis==='y') this.ry += dir;
    if (axis==='z') this.rz += dir;
    if (this.canPlace()) { this.sync(); return true; }
    const kicks = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]];
    for (const [dx,dy,dz] of kicks)
      if (this.canPlace(this.pos.x+dx,this.pos.y+dy,this.pos.z+dz)) {
        this.pos.x+=dx; this.pos.y+=dy; this.pos.z+=dz; this.sync(); return true;
      }
    this.rx=prev.rx; this.ry=prev.ry; this.rz=prev.rz; return false;
  }

  sync() {
    const cells = this.worldCells();
    for (let i=0;i<this.meshes.length;i++) {
      const m = this.meshes[i];
      const [x,y,z] = cells[i];
      m.position.set(x, y, z);
    }
  }

  freeze() {
    const cells = this.worldCells();
    for (let i=0;i<cells.length;i++) {
      const [x,y,z] = cells[i];
      occ[x][y][z] = true;
      const mesh = this.meshes[i];
      mesh.material = cubeMatFrozen;
      frozenMeshes[z].push(mesh);
    }
    this.meshes = [];
  }

  removeFromScene() { this.meshes.forEach(m=>scene.remove(m)); }
}

export function randomPiece() {
  const shape = SHAPES[Math.floor(Math.random()*SHAPES.length)];
  return new Piece(shape);
}
