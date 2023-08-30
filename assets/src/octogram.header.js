class Header {
  createElement(onBackCallback) {
    const appLogoImage = document.createElement('img');
    appLogoImage.src = 'assets/icons/applogo.svg';
    const arrowLeft = document.createElement('img');
    arrowLeft.classList.add('arrow');
    arrowLeft.src = 'assets/icons/arrowleft.svg';
    const appLogo = document.createElement('a');
    appLogo.classList.add('applogo');
    appLogo.classList.toggle('show-back', !!onBackCallback);
    appLogo.addEventListener('click', onBackCallback);
    appLogo.appendChild(arrowLeft);
    appLogo.appendChild(appLogoImage);

    const actions = document.createElement('div');
    actions.classList.add('actions');
    this.#appendActions(actions);

    const content = document.createElement('div');
    content.classList.add('content');
    content.appendChild(appLogo);
    content.appendChild(actions);
    
    const header = document.createElement('div');
    header.classList.add('header');
    header.appendChild(content);

    return header;
  }

  #appendActions(actions) {
    actions.appendChild(this.#createButton({
      text: 'Features',
      isSecondary: true,
      onClick: () => {
        if (utils.pageId != 'home') {
          homePage.init();
        }
        window.location.href = '#features';
      }
    }));
    
    actions.appendChild(this.#createButton({
      text: 'Download',
      onClick: () => {
        if (utils.pageId != 'home') {
          homePage.init();
        }
        window.location.href = '#download';
      }
    }));

    actions.appendChild(this.#createButton({
      text: 'DC Status',
      isSecondary: true,
      onClick: () => {
        if (utils.pageId != 'dcstatus') {
          dcStatus.init();
        }
      }
    }));

    actions.appendChild(this.#createButton({
      text: 'Source',
      isSecondary: true,
      url: 'https://github.com/OctoGramApp/OctoGram'
    }));
  }

  #createButton({
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
}

const header = new Header();