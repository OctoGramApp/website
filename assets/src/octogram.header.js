class Header {
  createElement({
    onBackCallback,
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
    this.#appendActions(actions);

    const content = document.createElement('div');
    content.classList.add('content');
    content.appendChild(appLogo);
    content.appendChild(actions);
    
    const header = document.createElement('div');
    header.classList.add('header');
    header.classList.toggle('as-error', isError);
    header.appendChild(content);

    return header;
  }

  #appendActions(actions) {
    actions.appendChild(this.#createButton({
      text: translations.getStringRef('HEADER_FEATURES'),
      isSecondary: true,
      onClick: () => {
        if (utils.pageId != homePage.id) {
          homePage.init();
        }
        window.location.href = '#features';
      }
    }));
    
    actions.appendChild(this.#createButton({
      text: translations.getStringRef('HEADER_DOWNLOAD'),
      onClick: () => {
        if (utils.pageId != changelog.id) {
          changelog.init();
        }
      }
    }));

    actions.appendChild(this.#createButton({
      text: translations.getStringRef('HEADER_DC_STATUS'),
      isSecondary: true,
      onClick: () => {
        if (utils.pageId != dcStatus.id) {
          dcStatus.init();
        }
      }
    }));

    actions.appendChild(this.#createButton({
      text: translations.getStringRef('HEADER_SOURCE'),
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