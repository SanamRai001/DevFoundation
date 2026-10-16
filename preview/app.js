// Intentionally browser-only: previewing the UI never sends user text to any server.
const form = document.querySelector('#notes-form');
const titleField = document.querySelector('#note-title');
const list = document.querySelector('#notes-list');
const empty = document.querySelector('#empty');
const count = document.querySelector('#note-count');
const error = document.querySelector('#error');
let notes = [];
let nextId = 1;

function showError(message) {
  error.textContent = message;
  error.hidden = !message;
}

function render() {
  list.replaceChildren();
  for (const note of notes) {
    const item = document.createElement('li');
    const label = document.createElement('label');
    label.className = 'note-label';
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = note.completed;
    check.setAttribute('aria-label', 'Mark ' + note.title + ' complete');
    check.addEventListener('change', () => {
      note.completed = check.checked;
      render();
    });
    const title = document.createElement('span');
    title.textContent = note.title; // Never inject untrusted HTML.
    if (note.completed) title.className = 'completed';
    label.append(check, title);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete';
    remove.textContent = 'Delete';
    remove.setAttribute('aria-label', 'Delete ' + note.title);
    remove.addEventListener('click', () => {
      notes = notes.filter((item) => item.id !== note.id);
      render();
      titleField.focus();
    });
    item.append(label, remove);
    list.append(item);
  }
  empty.hidden = notes.length !== 0;
  count.textContent = notes.length + (notes.length === 1 ? ' note' : ' notes') + ' in this preview';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = titleField.value.trim();
  if (title.length < 1 || title.length > 120) {
    showError('Please enter a note title (1–120 characters).');
    titleField.focus();
    return;
  }
  showError('');
  notes.unshift({ id: nextId++, title, completed: false });
  titleField.value = '';
  render();
  titleField.focus();
});

document.querySelector('#copy-command').addEventListener('click', async () => {
  const command = document.querySelector('#command').textContent;
  const result = document.querySelector('#copy-result');
  try {
    await navigator.clipboard.writeText(command);
    result.textContent = 'Command copied to clipboard.';
  } catch {
    result.textContent = 'Copy the command text above using your keyboard.';
  }
});
render();
