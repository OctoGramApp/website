class PrivacyPolicy {
  #precachedResponse;

  init() {
    utils.clearPage('privacypolicy');
    window.scrollTo(0, 0);
    document.title = 'OctoGram - ' + translations.getStringRef('PRIVACYPOLICY_TITLE_PAGE');
    history.pushState(null, document.title, '/privacy');

    const fakeLoadingCard = this.#generateFakeLoadingCard();
    
    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page');
    pageContainer.appendChild(header.createElement({
      onBackCallback: () => homePage.init()
    }));
    pageContainer.appendChild(this.#generatePointer());
    pageContainer.appendChild(fakeLoadingCard);
    pageContainer.appendChild(footer.createElement());

    document.body.appendChild(pageContainer);

    this.#loadPolicy(fakeLoadingCard);
  }

  #generatePointer() {
    const stickerImage = document.createElement('img');
    stickerImage.src = 'assets/animations/privacyAnimation.gif';
    const stickerContainer = document.createElement('div');
    stickerContainer.classList.add('sticker');
    stickerContainer.appendChild(stickerImage);
    const messageTitle = document.createElement('div');
    messageTitle.classList.add('title');
    messageTitle.textContent = translations.getStringRef('PRIVACYPOLICY_TITLE');

    const message = document.createElement('div');
    message.classList.add('message');
    message.appendChild(stickerContainer);
    message.appendChild(messageTitle);

    const content = document.createElement('div');
    content.classList.add('content');
    content.appendChild(message);

    const pointer = document.createElement('div');
    pointer.classList.add('pointer');
    pointer.appendChild(content);

    return pointer;
  }

  #generateFakeLoadingCard() {
    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = translations.getStringRef('PRIVACYPOLICY_LOADING');

    const loadingCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    loadingCircle.setAttributeNS(null, 'cx', '10');
    loadingCircle.setAttributeNS(null, 'cy', '10');
    loadingCircle.setAttributeNS(null, 'r', '8');
    loadingCircle.setAttributeNS(null, 'stroke-linecap', 'round');
    const loadingSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    loadingSvg.appendChild(loadingCircle);
    const description = document.createElement('div');
    description.classList.add('description');
    description.appendChild(loadingSvg);

    const descriptor = document.createElement('div');
    descriptor.classList.add('descriptor');
    descriptor.appendChild(title);
    descriptor.appendChild(description);

    const content = document.createElement('div');
    content.classList.add('content');
    content.appendChild(descriptor);
    const card = document.createElement('div');
    card.classList.add('card', 'changelog');
    card.appendChild(content);

    return card;
  }

  #loadPolicy(replaceTo) {
    if (typeof this.#precachedResponse != 'undefined') {
      this.#loadWithResponse(replaceTo, this.#precachedResponse);
    } else {
      const XML = new XMLHttpRequest();
      XML.open('GET', 'https://raw.githubusercontent.com/OctoGramApp/assets/privacy_policy/privacyPolicy/PrivacyPolicy.xml?cache='+Math.random().toString(), true);
      XML.send();
      XML.addEventListener('readystatechange', (e) => {
        if (e.target.readyState == 4 && e.target.status == 200) {
          const response = e.target.response;
          this.#precachedResponse = response;
          this.#loadWithResponse(replaceTo, response);
        }
      });
    }
  }

  #loadWithResponse(replaceTo, response) {
    const parser = new DOMParser();
    const xmlDocument = parser.parseFromString(response, "text/xml");

    const policyFragment = document.createDocumentFragment();

    for (const release of xmlDocument.getElementsByTagName('card')) {
      if (!release.getElementsByTagName('title').length || !release.getElementsByTagName('body').length) {
        continue;
      }

      const title = document.createElement('div');
      title.classList.add('title');
      title.textContent = release.getElementsByTagName('title')[0].textContent;
      const descriptor = document.createElement('div');
      descriptor.classList.add('descriptor');
      descriptor.appendChild(title);

      const message = document.createElement('div');
      message.classList.add('message');
      message.innerHTML = utils.fixInjectionTags(release.getElementsByTagName('body')[0].innerHTML);
      const body = document.createElement('div');
      body.classList.add('body');
      body.appendChild(message);

      const content = document.createElement('div');
      content.classList.add('content');
      content.appendChild(descriptor);
      content.appendChild(body);
      const card = document.createElement('div');
      card.classList.add('card', 'changelog');
      card.appendChild(content);

      policyFragment.append(card);
    }

    replaceTo.replaceWith(policyFragment);
  }
}

const privacyPolicy = new PrivacyPolicy();