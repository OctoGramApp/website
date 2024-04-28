import * as homePage from "./octogram.home.js";
import * as utils from "./octogram.utils.js";
import * as dcStatus from "./octogram.dcstatus.js";
import * as changelog from "./octogram.changelog.js";
import {getStringRef} from "./octogram.translations.js";

let lastHeaderElement;

function createElement({
  onBackCallback,
  isHomePage = false,
  isError = false
} = {}) {
  const appLogoImage = document.createElement('img');
  appLogoImage.src = 'assets/icons/applogo.svg';
  const arrowLeft = document.createElement('img');
  arrowLeft.classList.add('arrow');
  arrowLeft.src = 'assets/icons/arrowleft.svg';
  const appLogo = document.createElement('a');
  appLogo.classList.add('applogo');
  appLogo.classList.toggle('show-back', !!onBackCallback);
  onBackCallback && appLogo.addEventListener('click', onBackCallback);
  appLogo.appendChild(arrowLeft);
  appLogo.appendChild(appLogoImage);

  const actions = document.createElement('div');
  actions.classList.add('actions');
  appendActions(actions);

  const content = document.createElement('div');
  content.classList.add('content');
  content.appendChild(appLogo);
  content.appendChild(actions);

  const header = document.createElement('div');
  header.classList.add('header');
  header.classList.toggle('as-homepage', isHomePage && !isError);
  header.classList.toggle('as-error', isError && !isHomePage);
  header.appendChild(content);

  lastHeaderElement = header;

  return header;
}

function appendActions(actions) {
  actions.appendChild(createButton({
    text: getStringRef('HEADER_FEATURES'),
    isSecondary: true,
    onClick: () => {
      if (utils.currentPageId !== homePage.id) {
        homePage.init();
      }
      window.location.href = '#features';
    }
  }));

  actions.appendChild(createButton({
    text: getStringRef('HEADER_DOWNLOAD'),
    onClick: () => {
      if (utils.currentPageId !== changelog.id) {
        changelog.init();
      }
    }
  }));

  actions.appendChild(createButton({
    text: getStringRef('HEADER_DC_STATUS'),
    isSecondary: true,
    onClick: () => {
      if (utils.currentPageId !== dcStatus.id) {
        dcStatus.init();
      }
    }
  }));

  actions.appendChild(createButton({
    text: getStringRef('HEADER_SOURCE'),
    isSecondary: true,
    url: 'https://github.com/OctoGramApp/OctoGram'
  }));
}

function createButton({
  text,
  isSecondary = false,
  onClick,
  url
}) {
  const textContainer = document.createElement('div');
  textContainer.classList.add('text');
  textContainer.textContent = text;
  const button = document.createElement('a');
  button.classList.add('button');
  button.classList.toggle('secondary', isSecondary);
  button.appendChild(textContainer);

  if (onClick) {
    button.addEventListener('click', onClick);
  } else if (url) {
    button.href = url;
    button.target = '_blank';
  }

  return button;
}

function reloadBlurState() {
  if (lastHeaderElement) {
    lastHeaderElement.classList.toggle('scrolled', window.scrollY > 40);
  }
}

export {
  createElement,
  reloadBlurState
};