const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => observer.observe(item));

const filterButtons = document.querySelectorAll('.filter-button');
const cards = document.querySelectorAll('.story-card');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    const filter = button.dataset.filter;
    cards.forEach((card) => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter));
  });
});

document.querySelector('.add-note').addEventListener('click', (event) => {
  event.currentTarget.innerHTML = '<span>✓</span> 다음 장면은 곧 추가됩니다';
});

const dialog = document.querySelector('.editor-dialog');
const editorForm = dialog.querySelector('.editor-form');
let activeCard;
document.querySelector('.edit-mode-button').addEventListener('click', () => {
  document.body.classList.toggle('editor-mode');
});
document.querySelectorAll('.page-edit').forEach((button) => {
  button.addEventListener('click', () => {
    activeCard = button.closest('.story-card');
    editorForm.elements.year.value = activeCard.querySelector('.card-year').childNodes[0].textContent.trim();
    editorForm.elements.title.value = activeCard.querySelector('h3').innerText.replace(/\n/g, ' ');
    editorForm.elements.description.value = activeCard.querySelector('p').innerText;
    dialog.showModal();
  });
});
editorForm.addEventListener('submit', (event) => {
  if (event.submitter.value !== 'default') return;
  event.preventDefault();
  activeCard.querySelector('.card-year').childNodes[0].textContent = `${editorForm.elements.year.value} `;
  activeCard.querySelector('h3').innerText = editorForm.elements.title.value;
  activeCard.querySelector('p').innerText = editorForm.elements.description.value;
  const theme = editorForm.elements.theme.value;
  activeCard.className = `story-card reveal is-visible ${theme}`.trim();
  dialog.close();
});
