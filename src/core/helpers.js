import * as THREE from 'three';
import { scene } from './scene.js';
import { GRID_X, GRID_Y, GRID_Z, CUBE } from '../game/constants.js';

export function addPlayfieldHelpers() {
  const boxGeo = new THREE.BoxGeometry(GRID_X*CUBE, GRID_Y*CUBE, GRID_Z*CUBE);
  const boxMat = new THREE.MeshBasicMaterial({
    color: 0x8fb3,
    wireframe: false,
    transparent: true,
    opacity: 0.08
  });
  const box = new THREE.Mesh(boxGeo, boxMat);
  box.position.set((GRID_X-1)/2, (GRID_Y-1)/2, (GRID_Z-1)/2);
  scene.add(box);

  const edges = new THREE.EdgesGeometry(boxGeo);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x3a78ff })
  );
  line.position.copy(box.position);
  scene.add(line);

  const gridMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.35 });

  const gridGroup = new THREE.Group();
  const OFFSET = -0.5 * CUBE;

  for (let z = 0; z <= GRID_Z; z++) {
    for (let y = 0; y <= GRID_Y; y++) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, y*CUBE, z*CUBE),
        new THREE.Vector3(GRID_X*CUBE, y*CUBE, z*CUBE),
      ]);
      const ln = new THREE.Line(geo, gridMat);
      gridGroup.add(ln);
    }
    for (let x = 0; x <= GRID_X; x++) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x*CUBE, 0, z*CUBE),
        new THREE.Vector3(x*CUBE, GRID_Y*CUBE, z*CUBE),
      ]);
      const ln = new THREE.Line(geo, gridMat);
      gridGroup.add(ln);
    }
  }

  gridGroup.position.set(OFFSET, OFFSET, OFFSET);
  scene.add(gridGroup);
}
