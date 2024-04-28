import * as utils from "./octogram.utils.js";
import * as header from "./octogram.header.js";
import * as homePage from "./octogram.home.js";
import * as footer from "./octogram.footer.js";
import {getStringRef, getTextNodeByStringRef} from "./octogram.translations.js";

function init() {
  utils.clearPage('error');
  window.scrollTo(0, 0);
  document.title = 'OctoGram - 404';

  const pageContainer = document.createElement('div');
  pageContainer.classList.add('page');
  pageContainer.appendChild(header.createElement({
    onBackCallback: () => homePage.init(),
    isError: true
  }));
  pageContainer.appendChild(generateError());
  pageContainer.appendChild(footer.createElement());

  document.body.appendChild(pageContainer);
}

function generateError() {
  const messageTitle = document.createElement('div');
  messageTitle.classList.add('title');
  messageTitle.textContent = getStringRef('ERROR_TITLE');
  const messageDescription = document.createElement('div');
  messageDescription.classList.add('description');
  messageDescription.textContent = getStringRef('ERROR_DESCRIPTION');

  const buttonImage = document.createElement('img');
  buttonImage.src = 'assets/icons/applogo.svg';
  const buttonText = document.createElement('div');
  buttonText.classList.add('text');
  buttonText.appendChild(getTextNodeByStringRef('ERROR_BUTTON'));
  buttonText.appendChild(buttonImage);
  const button = document.createElement('a');
  button.classList.add('button', 'big', 'accent');
  button.addEventListener('click', () => homePage.init());
  button.appendChild(buttonText);

  const message = document.createElement('div');
  message.classList.add('message');
  message.appendChild(messageTitle);
  message.appendChild(messageDescription);
  message.appendChild(button);

  const error = document.createElement('div');
  error.classList.add('error');
  error.appendChild(message);

  return error;
}

export {
  init,
};