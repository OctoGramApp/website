class Footer {
  #currentExpandedCategory;

  createElement() {
    this.#currentExpandedCategory = undefined;

    const footerGoTopIcon = document.createElement('img');
    footerGoTopIcon.src = 'assets/icons/arrowright.svg';
    const footerGoTopButton = document.createElement('div');
    footerGoTopButton.classList.add('go-to-top-button');
    footerGoTopButton.addEventListener('click', () => window.scrollTo(0, 0));
    footerGoTopButton.appendChild(footerGoTopIcon);
    const footerGoTopContainer = document.createElement('div');
    footerGoTopContainer.classList.add('go-to-top');
    footerGoTopContainer.appendChild(footerGoTopButton);

    const linksContainer = document.createElement('div');
    linksContainer.classList.add('links');
    this.#appendLinkContainer(linksContainer, 'site');
    this.#appendLinkContainer(linksContainer, 'github');
    this.#appendLinkContainer(linksContainer, 'telegram');

    const footerTextFork = document.createElement('a');
    footerTextFork.href = 'https://github.com/OctoGramApp/Website/fork';
    footerTextFork.target = '_blank';
    footerTextFork.textContent = translations.getStringRef('FOOTER_TEXT_1');
    const footerText = document.createElement('div');
    footerText.classList.add('text');
    footerText.textContent = 'Octogram © ' + new Date().getFullYear().toString() + ' - ';
    footerText.appendChild(footerTextFork);
    footerText.appendChild(document.createElement('br'));
    footerText.appendChild(translations.getTextNodeByStringRef('FOOTER_TEXT_2'));

    const footerContainer = document.createElement('div');
    footerContainer.classList.add('footer', 'big');
    footerContainer.appendChild(footerGoTopContainer);
    footerContainer.appendChild(linksContainer);
    footerContainer.appendChild(footerText);

    return footerContainer;
  }

  #appendLinkContainer(container, id) {
    const singleLinkContainer = document.createElement('div');
    singleLinkContainer.addEventListener('click', () => {
      if (typeof this.#currentExpandedCategory != 'undefined') {
        this.#currentExpandedCategory.classList.remove('expanded');
      }

      singleLinkContainer.classList.add('expanded');
      this.#currentExpandedCategory = singleLinkContainer;
    });
    singleLinkContainer.classList.add('single-link-container');

    switch (id) {
      case 'site': {
        singleLinkContainer.appendChild(this.#generateContainerTitle(
          translations.getStringRef('FOOTER_SITE_TITLE')
        ));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_SITE_FEATURES'),
          onClick: () => {
            if (utils.pageId != homePage.id) {
              homePage.init();
            }
            window.location.href = '#features';
          }
        }));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_SITE_DOWNLOAD'),
          onClick: () => {
            if (utils.pageId != homePage.id) {
              homePage.init();
            }
            window.location.href = '#download';
          }
        }));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_SITE_DC_STATUS'),
          onClick: () => {
            if (utils.pageId != dcStatus.id) {
              dcStatus.init();
            }
          }
        }));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_SITE_CHANGELOG'),
          onClick: () => {
            if (utils.pageId != changelog.id) {
              changelog.init();
            }
          }
        }));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_SITE_PRIVACYPOLICY'),
          onClick: () => {
            if (utils.pageId != privacyPolicy.id) {
              privacyPolicy.init();
            }
          }
        }));
        break;
      }
      case 'github': {
        singleLinkContainer.appendChild(this.#generateContainerTitle(
          translations.getStringRef('FOOTER_GITHUB_TITLE')
        ));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_GITHUB_CLIENT_SOURCE'),
          url: 'https://github.com/OctoGramApp/OctoGram',
          openOnBlank: true
        }));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_GITHUB_CLIENT_LICENSE'),
          url: 'https://github.com/OctoGramApp/OctoGram/blob/develop/LICENSE',
          openOnBlank: true
        }));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_GITHUB_WEBSITE_SOURCE'),
          url: 'https://github.com/OctoGramApp/Website',
          openOnBlank: true
        }));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_GITHUB_WEBSITE_LICENSE'),
          url: 'https://github.com/OctoGramApp/Website/blob/main/LICENSE',
          openOnBlank: true
        }));
        break;
      }
      case 'telegram': {
        singleLinkContainer.appendChild(this.#generateContainerTitle(
          translations.getStringRef('FOOTER_TELEGRAM_TITLE')
        ));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_TELEGRAM_NEWS'),
          url: 'tg://resolve?domain=OctoGramApp'
        }));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_TELEGRAM_APKS'),
          url: 'tg://resolve?domain=OctoGramApks'
        }));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_TELEGRAM_BETA_APKS'),
          url: 'tg://resolve?domain=OctoGramBeta'
        }));
        singleLinkContainer.appendChild(this.#generateSingleLink({
          text: translations.getStringRef('FOOTER_TELEGRAM_SUPPORT'),
          url: 'tg://resolve?domain=OctoGramChat'
        }));
        break;
      }
    }

    container.appendChild(singleLinkContainer);
  }

  #generateContainerTitle(text) {
    const linkTitleChevron = document.createElement('img');
    linkTitleChevron.classList.add('expand');
    linkTitleChevron.src = 'assets/icons/chevrondown.svg';
    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    linkTitle.appendChild(document.createTextNode(text));
    linkTitle.appendChild(linkTitleChevron);
    return linkTitle;
  }

  #generateSingleLink({
    text,
    onClick,
    url,
    openOnBlank = false
  }) {
    const linkArrowRight = document.createElement('img');
    linkArrowRight.classList.add('icon');
    linkArrowRight.src = 'assets/icons/arrowright.svg';
    const linkText = document.createElement('div');
    linkText.classList.add('text');
    linkText.textContent = text;
    const linkElement = document.createElement('a');
    linkElement.classList.add('link');
    linkElement.appendChild(linkArrowRight);
    linkElement.appendChild(linkText);

    if (onClick) {
      linkElement.addEventListener('click', onClick);
    } else if (url) {
      linkElement.href = url;
      if (openOnBlank) {
        linkElement.target = '_blank';
      }
    }

    return linkElement;
  }
}

const footer = new Footer();