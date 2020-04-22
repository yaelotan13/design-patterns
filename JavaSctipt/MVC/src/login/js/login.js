import '../style/login.css';
import axios from 'axios';

axios.defaults.withCredentials = true;
let currentScreenIsSignUp = true;

function moveToSignInPage() {
  document.getElementById('use-your-account').classList.remove('hide');
  document.getElementById('forgot-password').classList.remove('hide');

  document.getElementById('sign-headline').innerHTML = 'Sign In';
  document.getElementById('toggle-have-account').innerHTML = 'Don\'t have an account yet?';
  document.getElementById('toggle-sign-in-up-but').innerHTML = 'Create Account';
  document.getElementById('sign-in-up-but').innerHTML = 'SIGN IN';

  document.getElementById('name-container').classList.add('hide');
  document.getElementById('status').classList.add('hide');

  document.getElementById('email').classList.add('moveUp');
  document.getElementById('password').classList.add('moveUp');
}

function moveToSignUp() {
  document.getElementById('use-your-account').classList.add('hide');
  document.getElementById('forgot-password').classList.add('hide');

  document.getElementById('sign-headline').innerHTML = 'Create Account';
  document.getElementById('toggle-have-account').innerHTML = 'Already have an account?';
  document.getElementById('toggle-sign-in-up-but').innerHTML = 'Log In';
  document.getElementById('sign-in-up-but').innerHTML = 'SIGN UP';

  document.getElementById('name-container').classList.remove('hide');
  document.getElementById('status').classList.remove('hide');

  document.getElementById('email').classList.remove('moveUp');
  document.getElementById('password').classList.remove('moveUp');
}

function toggleSignInPage() {
  if (currentScreenIsSignUp) {
    currentScreenIsSignUp = false;
    moveToSignInPage();
    return;
  }
  currentScreenIsSignUp = true;
  moveToSignUp();
}

function markAsAnErrorFiled(id) {
  document.getElementById(id).classList.add('show-error');
}

function showNotAllFieldsAreFilledError() {
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const status = document.getElementById('status').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  document.getElementById('empty-error').classList.remove('hide');

  if (!firstName) {
    markAsAnErrorFiled('first-name');
  }
  if (!lastName) {
    markAsAnErrorFiled('last-name');
  }
  if (!status) {
    markAsAnErrorFiled('status');
  }
  if (!email) {
    markAsAnErrorFiled('email');
  }
  if (!password) {
    markAsAnErrorFiled('password');
  }
}

function signUpUser() {
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const status = document.getElementById('status').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!firstName || !lastName || !status || !email || !password) {
    showNotAllFieldsAreFilledError();
    return;
  }

  (async () => {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    try {
      return await axios.post('http://127.0.0.1:3333/users', {
        firstName,
        lastName,
        status,
        email,
        password,
      }, { withCredentials: true }).then((response) => {
        console.log(response);
        if (response.status === 200) {
          window.location.href = '../feed/index.html';
        }
      }, (e) => {
        console.log(e);
      });
    } catch (e) {
      console.error(e);
    }
  })();
}

function signInUser() {
  console.log('sign in user');
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showNotAllFieldsAreFilledError();
    return;
  }

  (async () => {
    try {
      return await axios.post('http://127.0.0.1:3333/signin', {
        email,
        password,
      }).then((response) => {
        console.log(response);
        if (response.status === 200) {
          window.location.href = '../feed/index.html';
        }
      }, (error) => {
        console.log(error);
      });
    } catch (error) {
      console.error(error);
    }
  })();
}

function submitButPushed() {
  if (currentScreenIsSignUp) {
    signUpUser();
    return;
  }

  signInUser();
}

document.getElementById('toggle-sign-in-up-but').addEventListener('click', toggleSignInPage);
document.getElementById('sign-in-up-but').addEventListener('click', submitButPushed)
