export function bindKeys(onKey) {
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === ' ') e.preventDefault();
    onKey(e.key);
  });
}
