import { initScene, renderer, scene, camera, controls } from './core/scene.js';
import { addPlayfieldHelpers } from './core/helpers.js';
import { bindKeys } from './game/input.js';
import { startGame, update, onKey } from './game/game.js';

initScene();
addPlayfieldHelpers();
bindKeys(onKey);
startGame();

function loop(t){
  controls.update();
  update(t);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
