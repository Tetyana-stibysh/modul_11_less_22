const BASE_URL = 'http://localhost:3000/todos';

const form = document.querySelector('.todo-form');
const container = document.querySelector('.list');

form.addEventListener('submit', handlerSubmit);
container.addEventListener('click', handleUpdate);
container.addEventListener('click', handleDelete);

function fetchData(url = BASE_URL, options = {}) {
  return fetch(url, options).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

fetchData(BASE_URL)
  .then(data => container.insertAdjacentHTML('beforeend', createMarkup(data)))
  .catch(error => console.log(error.message));

function createMarkup(arr) {
  return arr
    .map(
      ({ id, title, completed }) => `
        <li data-id="${id}" class="list__item">
            <input type="checkbox" class="list__checkbox" ${
              completed && 'checked'
            } >
            <h2 class="list__title">${title}</h2>
            <button class="list__btn">X</button>
        </li>
    `
    )
    .join('');
}

function handlerSubmit(event) {
  event.preventDefault();

  const { todo } = event.target.elements;

  fetchData(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: todo.value, completed: false }),
  })
    .then(data => {
      container.insertAdjacentHTML('beforeend', createMarkup([data]));
    })
    .catch(error => console.log(error.message))
    .finally(() => event.target.reset());
}

function handleUpdate(event) {
  if (!event.target.classList.contains('list__checkbox')) {
    return;
  }

  event.preventDefault();

  const parent = event.target.closest('.list__item');
  const id = parent.dataset.id;

  fetchData(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed: event.target.checked }),
  })
    .then(data => (event.target.checked = data.completed))
    .catch(error => console.log(error.message));
}

function handleDelete(event) {
  if (!event.target.classList.contains('list__btn')) {
    return;
  }

  const parent = event.target.closest('.list__item');
  const id = parent.dataset.id;

  fetchData(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
    .then(data => parent.remove())
    .catch(error => console.log(error.message));
}
