document.documentElement.dataset.theme = 'light';
const menuButton = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');
function closeMenu() {
  header.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  header.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('#primary-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {if (!header.contains(event.target)) closeMenu();});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('menu-open')) {
    closeMenu();
    menuButton.focus();
  }
});

const copyTimers = new WeakMap();
document.querySelectorAll('.copy-email-btn').forEach(button => {
  button.addEventListener('click', async () => {
    clearTimeout(copyTimers.get(button));
    let copied = false;
    try {await navigator.clipboard.writeText(button.dataset.email);copied = true;}
    catch (_) {
      // The static HTTP preview may not expose the secure Clipboard API.
      const field = document.createElement('textarea');
      field.value = button.dataset.email;
      field.readOnly = true;
      field.style.cssText = 'position:fixed;left:-9999px;top:0;';
      document.body.appendChild(field);
      field.select();
      try {copied = document.execCommand('copy');} catch (_) {}
      field.remove();
      button.focus({preventScroll:true});
    }
    if (!copied) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.contact-email'));
      selection.removeAllRanges();selection.addRange(range);
    }
    button.textContent = copied ? 'Email copied' : 'Email selected — press Ctrl/Cmd+C';
    copyTimers.set(button, setTimeout(() => {button.textContent = 'Copy email address';}, 3500));
  });
});

// A precise custom arrow and one soft, trailing ring. No particle trail or renderer.
const cursorButton = document.getElementById('cursor-toggle');
const halo = document.querySelector('.cursor-halo');
const pointerMedia = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
let cursorWanted = true;
let cursorActive = false;
let x = 0, y = 0, targetX = 0, targetY = 0, frame = 0, positioned = false;
function hideHalo() {
  halo.classList.remove('is-visible', 'is-link', 'is-pressed');
  cancelAnimationFrame(frame);frame = 0;positioned = false;
}
function updateCursor() {
  cursorActive = cursorWanted && pointerMedia.matches;
  document.documentElement.classList.toggle('cursor-enabled', cursorActive);
  cursorButton.setAttribute('aria-pressed', String(cursorActive));
  cursorButton.disabled = !pointerMedia.matches;
  const label = cursorActive ? 'Turn off cursor effect' : 'Turn on cursor effect';
  cursorButton.setAttribute('aria-label', label);cursorButton.title = label;
  if (!cursorActive) hideHalo();
}
function drawHalo() {
  x += (targetX - x) * .22;
  y += (targetY - y) * .22;
  halo.style.transform = `translate3d(${x}px,${y}px,0)`;
  if (Math.abs(targetX - x) + Math.abs(targetY - y) > .1) frame = requestAnimationFrame(drawHalo);
  else frame = 0;
}
document.addEventListener('pointermove', event => {
  if (!cursorActive || event.pointerType !== 'mouse') return;
  targetX = event.clientX;targetY = event.clientY;
  if (!positioned) {x = targetX;y = targetY;positioned = true;}
  halo.classList.add('is-visible');
  if (!frame) frame = requestAnimationFrame(drawHalo);
}, {passive:true});
document.addEventListener('pointerover', event => {
  if (!cursorActive) return;
  halo.classList.toggle('is-link', !!event.target.closest('a,button,summary'));
});
document.addEventListener('pointerdown', () => {if (cursorActive) halo.classList.add('is-pressed');});
document.addEventListener('pointerup', () => halo.classList.remove('is-pressed'));
document.documentElement.addEventListener('pointerleave', hideHalo);
document.addEventListener('visibilitychange', () => {if (document.hidden) hideHalo();});
document.addEventListener('keydown', event => {if (event.key === 'Tab') hideHalo();});
cursorButton.addEventListener('click', () => {cursorWanted = !cursorWanted;updateCursor();});
pointerMedia.addEventListener('change', updateCursor);
updateCursor();
