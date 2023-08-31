class Changelog {
  #precachedResponse;

  init() {
    utils.clearPage('changelog');
    window.scrollTo(0, 0);
    document.title = 'OctoGram - Changelog';
    history.pushState(null, document.title, '/changelog');

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

    this.#loadVersions(fakeLoadingCard);
  }

  #generatePointer() {
    const stickerImage = document.createElement('img');
    stickerImage.src = 'assets/animations/changelogAnimation.gif';
    const stickerContainer = document.createElement('div');
    stickerContainer.classList.add('sticker');
    stickerContainer.appendChild(stickerImage);
    const messageTitle = document.createElement('div');
    messageTitle.classList.add('title');
    messageTitle.textContent = translations.getStringRef('CHANGELOG_TITLE');

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
    title.textContent = translations.getStringRef('CHANGELOG_LOADING');

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

  #loadVersions(replaceTo) {
    if (typeof this.#precachedResponse != 'undefined') {
      this.#loadWithResponse(replaceTo, this.#precachedResponse);
    } else {
      const XML = new XMLHttpRequest();
      XML.open('GET', 'https://api.github.com/repos/OctoGramApp/OctoGram/releases?cache='+Math.random().toString(), true);
      XML.send();
      XML.addEventListener('readystatechange', (e) => {
        if (e.target.readyState == 4 && e.target.status == 200) {
          const response = JSON.parse(e.target.responseText);
  
          if (response.length > 0) {
            this.#precachedResponse = response;
            this.#loadWithResponse(replaceTo, response);
          }
        }
      });
    }
  }

  #loadWithResponse(replaceTo, response) {
    const releasesFragment = document.createDocumentFragment();

    for (const release of response) {
      if (!release['assets'].length) {
        continue;
      }

      let selectedOption;
      let downloadsCount = 0;
      let availableOptions = [];
      let assetsNames = [];
      for(const asset of release['assets']) {
        downloadsCount += asset['download_count'];
        availableOptions.push({
          id: asset['id'],
          title: utils.parseApkName(asset['name']),
          description: utils.calculateSize(asset['size'], false)
        });
        assetsNames.push(asset['name']);
      }

      const validVersion = utils.tryToGetValidVersion(assetsNames);
      let selectMenuDescription = '';
      if (typeof validVersion == 'string') {
        selectMenuDescription = translations.getStringRef('CHANGELOG_DOWNLOAD_SUBTITLE_SUGGESTION');
        selectMenuDescription += ' ';
      }
      selectMenuDescription += translations.getStringRef('CHANGELOG_DOWNLOAD_SUBTITLE');

      const title = document.createElement('div');
      title.classList.add('title');
      title.appendChild(document.createTextNode(release['name']));

      if (release['prerelease']) {
        const titleBadge = document.createElement('span');
        titleBadge.classList.add('badge');
        titleBadge.textContent = translations.getStringRef('CHANGELOG_DOWNLOAD_BETA');
        title.appendChild(titleBadge);
      }

      const description = document.createElement('div');
      description.classList.add('description');
      description.textContent = release['assets'].length+' files, '+downloadsCount+' downloads';

      const descriptor = document.createElement('div');
      descriptor.classList.add('descriptor');
      descriptor.appendChild(title);
      descriptor.appendChild(description);

      const message = document.createElement('div');
      message.classList.add('message');
      message.innerHTML = utils.fixInjectionTags(release['body']);
      
      const selectValue = document.createElement('span');
      selectValue.classList.add('value');
      selectValue.textContent = translations.getStringRef('CHANGELOG_DOWNLOAD_SELECT');
      const selectIcon = document.createElement('img');
      selectIcon.classList.add('icon');
      selectIcon.src = '/assets/icons/arrowright.svg';
      const select = document.createElement('div');
      select.classList.add('select');
      select.appendChild(selectValue);
      select.appendChild(selectIcon);
      const button = document.createElement('div');
      button.classList.add('button', 'big', 'accent');
      button.classList.add('disabled');
      button.textContent = translations.getStringRef('CHANGELOG_DOWNLOAD_BUTTON');
      const download = document.createElement('div');
      download.classList.add('download');
      download.appendChild(select);
      download.appendChild(button);

      const body = document.createElement('div');
      body.classList.add('body');
      body.appendChild(message);
      body.appendChild(download);

      const content = document.createElement('div');
      content.classList.add('content');
      content.appendChild(descriptor);
      content.appendChild(body);
      const card = document.createElement('div');
      card.classList.add('card', 'changelog');
      card.appendChild(content);

      utils.parseCustomSelectMenu({
        element: select,
        availableOptions: availableOptions,
        description: selectMenuDescription,
        callback: (id) => {
          selectedOption = id;

          for(const option of availableOptions) {
            if (option.id == id) {
              selectValue.textContent = option.title;
              button.classList.remove('disabled');
              break;
            }
          }
        }
      });

      button.addEventListener('click', () => {
        for(const asset of release['assets']) {
          if (asset['id'] == parseInt(selectedOption)) {
            window.location.href = asset['browser_download_url'];
          }
        }
      });
      
      releasesFragment.append(card);
    }

    replaceTo.replaceWith(releasesFragment);
  }
}

const changelog = new Changelog();