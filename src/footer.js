import axios from 'axios';
const form = document.querySelector('.footer-form');
const ivalidEmail = document.querySelector('.check-inv');
const succEmail = document.querySelector('.check-succ');
const BASE_URL = 'https://portfolio-js.b.goit.study/api/requests';

console.dir(form[0]);

form.addEventListener('submit', handleSubmit);
async function servicePost(url, option) {
  const response = await axios(url, option);
  return response.data;
}

async function handleSubmit(event) {
  event.preventDefault();

  const email = event.target.elements.email.value.trim();
  const comment = event.target.elements.text.value.trim();

  if (!email || email.ValidityState.patternMismatch) {
    ivalidEmail.classList.remove('visually-hidden');
    return;
  }

  console.log(email, comment);
  try {
    const dataUpdated = await servicePost(BASE_URL, {
      method: 'POST',
      data: {
        email: `${email}`,
        comment: `${comment}`,
      },
    });
    console.log(dataUpdated);
  } catch (error) {
    console.log(error.message);
  }
}
