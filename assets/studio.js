document.documentElement.dataset.theme = "light";
const menuButton = document.querySelector('.menu-toggle');
const header = document.querySelector('.site-header');
function closeMenu() {header.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  header.classList.toggle('menu-open',open);menuButton.setAttribute('aria-expanded',String(open));
});
document.querySelectorAll('#primary-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown',event => {
  if(event.key === 'Escape') {
    if(header.classList.contains('menu-open')) {closeMenu();menuButton.focus();}
    document.querySelectorAll('.character-card[open]').forEach(card => {card.open = false;card.querySelector('summary').focus();});
  }
});
document.querySelectorAll('.copy-email-btn').forEach(button => {
  button.addEventListener('click', async () => {
    try {await navigator.clipboard.writeText(button.dataset.email);button.textContent='Email copied';}
    catch (_) {button.textContent='Select the email address above to copy';}
    setTimeout(() => {button.textContent='Copy email address';},2500);
  });
});
// Native disclosures keep the guide usable without a renderer or external assets.
document.addEventListener('click',event => {
  document.querySelectorAll('.character-card[open]').forEach(card => {if(!card.contains(event.target))card.open=false;});
});
