export function rotX([x,y,z]) { return [x, z, -y]; }
export function rotY([x,y,z]) { return [-z, y, x]; }
export function rotZ([x,y,z]) { return [y, -x, z]; }

export function applyRotations(cells, rx=0, ry=0, rz=0) {
  let out = cells.map(c=>[...c]);
  for (let i=0;i<(rx%4+4)%4;i++) out = out.map(rotX);
  for (let i=0;i<(ry%4+4)%4;i++) out = out.map(rotY);
  for (let i=0;i<(rz%4+4)%4;i++) out = out.map(rotZ);
  return out;
}

export function makeOcc(w,h,d, fill=false) {
  return Array.from({length:w}, _ =>
    Array.from({length:h}, __ => Array.from({length:d}, ___ => fill))
  );
}

export function isInside(w,h,d, x,y,z) {
  return x>=0 && x<w && y>=0 && y<h && z>=0 && z<d;
}

export function canPlaceCells(occ, cells, nx,ny,nz) {
  const w = occ.length, h = occ[0].length, d = occ[0][0].length;
  return cells.every(([dx,dy,dz]) => {
    const x = nx+dx, y = ny+dy, z = nz+dz;
    return isInside(w,h,d,x,y,z) && !occ[x][y][z];
  });
}

export function clearFullLayersPure(occ) {
  const w = occ.length, h = occ[0].length, d = occ[0][0].length;
  const out = makeOcc(w,h,d,false);
  for (let x=0;x<w;x++) for (let y=0;y<h;y++) for (let z=0;z<d;z++) out[x][y][z] = occ[x][y][z];
  let cleared = 0;
  for (let z=0; z<d; z++) {
    let full = true;
    outer: for (let x=0; x<w; x++) {
      for (let y=0; y<h; y++) if (!out[x][y][z]) { full=false; break outer; }
    }
    if (full) {
      cleared++;
      for (let zz=z+1; zz<d; zz++) {
        for (let x=0;x<w;x++) for (let y=0;y<h;y++) out[x][y][zz-1] = out[x][y][zz];
      }
      for (let x=0;x<w;x++) for (let y=0;y<h;y++) out[x][y][d-1] = false;
      z--;
    }
  }
  return { cleared, occ: out };
}
