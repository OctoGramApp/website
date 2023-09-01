class HomePage {
  #precachedResponse;
  #downloadContent;
  #downloadFiles;

  init() {
    utils.clearPage('home');
    window.scrollTo(0, 0);
    document.title = 'OctoGram';
    history.pushState(null, document.title, '/');

    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page');
    pageContainer.appendChild(header.createElement());
    pageContainer.appendChild(this.#generateIntroduction());
    pageContainer.appendChild(this.#generateFeatures());
    pageContainer.appendChild(this.#generateAdvantages());
    pageContainer.appendChild(this.#generateMonet());
    pageContainer.appendChild(this.#generateDownload());
    pageContainer.appendChild(footer.createElement());

    document.body.appendChild(pageContainer);

    this.#loadVersions();
  }

  #generateIntroduction() {
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');

    // TODO: manage messageTitle

    const messageTitleClient = document.createElement('span');
    messageTitleClient.classList.add('appname');
    messageTitleClient.textContent = ' OctoGram';
    const messageTitle = document.createElement('div');
    messageTitle.classList.add('title');
    messageTitle.appendChild(translations.getStringRef('INTRODUCTION_DISCOVER', messageTitleClient));
    const messageDescription = document.createElement('div');
    messageDescription.classList.add('description');
    messageDescription.textContent = translations.getStringRef('INTRODUCTION_DISCOVER_DESCRIPTION');
    const message = document.createElement('div');
    message.classList.add('message');
    message.appendChild(messageTitle);
    message.appendChild(messageDescription);

    const illustrationContainer = document.createElement('div');
    illustrationContainer.classList.add('illustration');
    illustrationContainer.dataset.state = '1';
    illustrationContainer.appendChild(this.#generateImage({
      imageUrl: 'assets/images/settings.darkmode.jpg',
      iconUrl: 'assets/icons/settings.svg',
      mainText: translations.getStringRef('INTRODUCTION_SETTINGS'),
      isActive: true
    }));
    illustrationContainer.appendChild(this.#generateImage({
      imageUrl: 'assets/images/chats.darkmode.jpg',
      iconUrl: 'assets/icons/chats.svg',
      mainText: translations.getStringRef('INTRODUCTION_CHAT'),
      bottomText: translations.getStringRef('INTRODUCTION_CHAT_EXPAND')
    }));
    illustrationContainer.appendChild(this.#generateImage({
      imageUrl: 'assets/images/appearance.darkmode.jpg',
      iconUrl: 'assets/icons/appearance.svg',
      mainText: translations.getStringRef('INTRODUCTION_APPEARANCE'),
      bottomText: translations.getStringRef('INTRODUCTION_APPEARANCE_EXPAND')
    }));

    const introductionContent = document.createElement('div');
    introductionContent.classList.add('content');
    introductionContent.appendChild(placeholder);
    introductionContent.appendChild(message);
    introductionContent.appendChild(illustrationContainer);

    const introduction = document.createElement('div');
    introduction.classList.add('introduction');
    introduction.appendChild(introductionContent);

    return introduction;
  }

  #generateImage({
    imageUrl,
    iconUrl,
    mainText,
    bottomText,
    isActive = false
  }) {
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;

    const iconElement = document.createElement('img');
    iconElement.src = iconUrl;
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('icon');
    iconContainer.appendChild(iconElement);
    const textContainer = document.createElement('div');
    textContainer.classList.add('text');
    textContainer.textContent = mainText;
    const fullPlaceholder = document.createElement('div');
    fullPlaceholder.classList.add('full-placeholder');
    fullPlaceholder.appendChild(iconContainer);
    fullPlaceholder.appendChild(textContainer);
    
    const pauseIcon = document.createElement('img');
    pauseIcon.src = 'assets/icons/pause.svg';
    const pauseContainer = document.createElement('div');
    pauseContainer.classList.add('pause');
    pauseContainer.appendChild(pauseIcon);

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image');
    imageContainer.classList.toggle('active', isActive);
    imageContainer.appendChild(imageElement);
    imageContainer.appendChild(fullPlaceholder);
    imageContainer.appendChild(pauseContainer);

    if (bottomText) {
      const bottomPlaceholderText = document.createElement('div');
      bottomPlaceholderText.classList.add('text');
      bottomPlaceholderText.textContent = bottomText ?? '';
      const bottomPlaceholder = document.createElement('div');
      bottomPlaceholder.classList.add('bottom-placeholder');
      bottomPlaceholder.appendChild(bottomPlaceholderText);
      imageContainer.insertBefore(bottomPlaceholder, pauseContainer);
    }

    return imageContainer;
  }

  #generateFeatures() {
    const featuresAppName = document.createElement('span');
    featuresAppName.classList.add('appname');
    featuresAppName.textContent = 'OctoGram';
    const featuresTitle = document.createElement('div');
    featuresTitle.classList.add('title');
    featuresTitle.appendChild(translations.getStringRef('FEATURES_TITLE', featuresAppName));

    const listPlaceholderIcon = document.createElement('img');
    listPlaceholderIcon.src = 'assets/icons/applogo.svg';
    const listPlaceholder = document.createElement('div');
    listPlaceholder.classList.add('placeholder');
    listPlaceholder.appendChild(listPlaceholderIcon);
    const list = document.createElement('div');
    list.classList.add('list');
    list.appendChild(listPlaceholder);
    this.#appendFeaturesItems(list);

    const featuresContainer = document.createElement('div');
    featuresContainer.classList.add('features');
    featuresContainer.appendChild(featuresTitle);
    featuresContainer.appendChild(list);
    
    const featuresSection = document.createElement('section');
    featuresSection.id = 'features';
    featuresSection.appendChild(featuresContainer);

    return featuresSection;
  }

  #appendFeaturesItems(list) {
    const featuresItems = [
      [
        'assets/images/features.buttons.jpg',
        translations.getStringRef('FEATURES_ALTERNATIVE_BUTTONS')
      ],
      [
        'assets/images/features.creationdate.jpg',
        translations.getStringRef('FEATURES_REGISTRATION_DATE')
      ],
      [
        'assets/images/features.dc.jpg',
        translations.getStringRef('FEATURES_DCID_INDICATOR')
      ],
      [
        'assets/images/features.dcstatus.jpg',
        translations.getStringRef('FEATURES_DC_STATUS')
      ],
      [
        'assets/images/features.details.jpg',
        translations.getStringRef('FEATURES_MESSAGE_DETAILS')
      ],
      [
        'assets/images/features.menuitems.jpg',
        translations.getStringRef('FEATURES_CUSTOMIZABLE_MENU')
      ],
      [
        'assets/images/features.experimental.jpg',
        translations.getStringRef('FEATURES_EXPERIMENTAL_SETTINGS')
      ],
      [
        translations.getStringRef('FEATURES_EXTRA_TITLE_1'),
        translations.getStringRef('FEATURES_EXTRA_TITLE_2'),
        translations.getStringRef('FEATURES_EXTRA_BUTTON')
      ]
    ];

    for(const item of featuresItems) {
      let element;
      if (item.length == 2) {
        element = this.#generateFeaturesItem(...item);
      } else {
        element = this.#generateFeaturesExtraItem(...item);
      }

      parallaxHelper.registerForParallax({
        element: element,
        basedOnContainer: list
      });

      list.appendChild(element);
    }
  }

  #generateFeaturesItem(imageUrl, text) {
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image');
    imageContainer.appendChild(imageElement);

    const textContainer = document.createElement('div');
    textContainer.classList.add('text');
    textContainer.textContent = text;

    const item = document.createElement('div');
    item.classList.add('item');
    item.appendChild(imageContainer);
    item.appendChild(textContainer);

    return item;
  }

  #generateFeaturesExtraItem(title1, title2, button) {
    const textContainer = document.createElement('div');
    textContainer.classList.add('text');
    textContainer.appendChild(document.createTextNode(title1));
    textContainer.appendChild(document.createElement('br'));
    textContainer.appendChild(document.createTextNode(title2));

    const buttonElement = document.createElement('div');
    buttonElement.classList.add('button', 'big', 'accent');
    buttonElement.textContent = button;

    const item = document.createElement('div');
    item.classList.add('item', 'extra');
    item.appendChild(textContainer);
    item.appendChild(buttonElement);

    return item;
  }

  #generateAdvantages() {
    const messageTitle = document.createElement('div');
    messageTitle.classList.add('title');
    messageTitle.textContent = translations.getStringRef('ADVANTAGES_TITLE');
    const messageDescription = document.createElement('div');
    messageDescription.classList.add('description');
    messageDescription.textContent = translations.getStringRef('ADVANTAGES_DESCRIPTION');
    const message = document.createElement('div');
    message.classList.add('message');
    message.appendChild(messageTitle);
    message.appendChild(messageDescription);

    const items = document.createElement('div');
    items.classList.add('items');
    this.#appendAdvantagesItems(items);

    const advantagesContainer = document.createElement('div');
    advantagesContainer.classList.add('advantages');
    advantagesContainer.appendChild(message);
    advantagesContainer.appendChild(items);

    parallaxHelper.registerForParallax({
      element: advantagesContainer
    });

    parallaxHelper.registerForParallax({
      element: message,
      basedOnContainer: advantagesContainer
    });

    const advantagesSection = document.createElement('section');
    advantagesSection.id = 'advantages';
    advantagesSection.appendChild(advantagesContainer);

    return advantagesSection;
  }

  #appendAdvantagesItems(list) {
    list.appendChild(this.#generateAdvantagesItem(
      'assets/animations/wallpaperAnimation.gif',
      translations.getStringRef('ADVANTAGES_ROWS_1')
    ));
    list.appendChild(this.#generateAdvantagesSeparator());
    list.appendChild(this.#generateAdvantagesItem(
      'assets/animations/tosCompliantAnimation.gif',
      translations.getStringRef('ADVANTAGES_ROWS_2')
    ));
    list.appendChild(this.#generateAdvantagesSeparator());
    list.appendChild(this.#generateAdvantagesItem(
      'assets/animations/premiumAnimation.gif',
      translations.getStringRef('ADVANTAGES_ROWS_3')
    ));
  }

  #generateAdvantagesSeparator() {
    const separator = document.createElement('div');
    separator.classList.add('separator');
    return separator;
  }

  #generateAdvantagesItem(imageUrl, text) {
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    const textContainer = document.createElement('div');
    textContainer.classList.add('title');
    textContainer.textContent = text;
    const item = document.createElement('div');
    item.classList.add('item');
    item.appendChild(imageElement);
    item.appendChild(textContainer);
    return item;
  }

  #generateMonet() {
    const messageScrolling = document.createElement('div');
    messageScrolling.classList.add('scrolling');
    const messageTitle = document.createElement('div');
    messageTitle.classList.add('title');
    messageTitle.textContent = translations.getStringRef('MONET_TITLE');
    const messageDescription = document.createElement('div');
    messageDescription.classList.add('description');
    messageDescription.textContent = translations.getStringRef('MONET_DESCRIPTION');
    const message = document.createElement('div');
    message.classList.add('introduction');
    message.appendChild(messageScrolling);
    message.appendChild(messageTitle);
    message.appendChild(messageDescription);

    const examplesFragment = document.createDocumentFragment();
    this.#appendMonetItems(examplesFragment);

    const monetThemeContainer = document.createElement('div');
    monetThemeContainer.classList.add('monet-theme');
    monetThemeContainer.appendChild(message);
    monetThemeContainer.appendChild(examplesFragment);

    const monetThemeReference = document.createElement('div');
    monetThemeReference.classList.add('monet-theme-reference');
    monetThemeReference.appendChild(monetThemeContainer);

    parallaxHelper.registerForParallax({
      element: monetThemeReference,
      isMonetMainCheck: true
    });

    const monetThemeSection = document.createElement('section');
    monetThemeSection.id = 'monet';
    monetThemeSection.appendChild(monetThemeReference);

    return monetThemeSection;
  }

  #appendMonetItems(fragment) {
    const examples = [
      'zESYp16iThwi1hUt',
      'jOexorm0x08B9W8h',
      'rrJaGzN1uzqALEas',
      'I4SIy4GEKXXKuHFB',
      'QC7Za4p0DHsGzpyK'
    ];

    for(const [id, example] of examples.entries()) {
      const element = this.#generateMonetExample(
        id,
        'assets/images/monetstyling/cop.' + id.toString() + '.home.png',
        'assets/images/monetstyling/cop.' + id.toString() + '.client.png',
        example,
        translations.getStringRef('MONET_TRY').toUpperCase()
      );

      parallaxHelper.registerForParallax({
        element: element,
        ignoreMobileCheck: true
      });

      fragment.append(element);
    }

    const monetFooter = this.#generateMonetFooter(
      translations.getStringRef('MONET_FOOTER_TITLE'),
      translations.getStringRef('MONET_FOOTER_DESCRIPTION')
    );
    fragment.append(monetFooter);

    parallaxHelper.registerForParallax({
      element: monetFooter,
      ignoreMobileCheck: true,
      set1AfterScroll: true
    });

    const progress = document.createElement('div');
    progress.classList.add('progress');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressBar.appendChild(progress);

    fragment.append(progressBar);
  }

  #generateMonetExample(id, homeImage, clientImage, tryThemeSlug, tryThemeText) {
    const backgroundPlaceholder = document.createElement('div');
    backgroundPlaceholder.classList.add('background-image');
    
    const arrowIcon = document.createElement('img');
    arrowIcon.classList.add('icon');
    arrowIcon.src = 'assets/icons/arrowright.svg';
    const centeredContainer = document.createElement('div');
    centeredContainer.classList.add('container');
    centeredContainer.appendChild(this.#generateMonetDeviceImage(homeImage, false));
    centeredContainer.appendChild(arrowIcon);
    centeredContainer.appendChild(this.#generateMonetDeviceImage(clientImage, true));
  
    const tryThemeContainer = document.createElement('a');
    tryThemeContainer.classList.add('add');
    tryThemeContainer.href = 'tg://addtheme?slug=' + tryThemeSlug;
    tryThemeContainer.textContent = tryThemeText;

    const example = document.createElement('div');
    example.classList.add('example');
    example.dataset.id = String(id);
    example.appendChild(backgroundPlaceholder);
    example.appendChild(centeredContainer);
    example.appendChild(tryThemeContainer);

    return example;
  }

  #generateMonetDeviceImage(imageUrl, isClient) {
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('device');
    imageContainer.classList.toggle('client', isClient);
    imageContainer.classList.toggle('screenshot', !isClient);
    imageContainer.appendChild(imageElement);
    return imageContainer;
  }

  #generateMonetFooter(messageTitleText, messageDescriptionText) {
    const animatedColors = ['d9e3f0', 'ffdcbb', 'dbea98', 'ffdad8', 'a8f2cf'];
    
    const colorsContainer = document.createElement('div');
    colorsContainer.classList.add('colors');
    for(const color of animatedColors) {
      const colorElement = document.createElement('div');
      colorElement.classList.add('color');
      colorElement.style.setProperty('--color', '#' + color);
      colorsContainer.appendChild(colorElement);
    }

    const messageIconImage = document.createElement('img');
    messageIconImage.src = 'assets/icons/applogo.svg';
    const messageIcon = document.createElement('div');
    messageIcon.classList.add('icon');
    messageIcon.appendChild(messageIconImage);
    const messageTitle = document.createElement('div');
    messageTitle.classList.add('title');
    messageTitle.textContent = messageTitleText;
    const messageDescription = document.createElement('div');
    messageDescription.classList.add('description');
    messageDescription.textContent = messageDescriptionText;
    const message = document.createElement('div');
    message.classList.add('message');
    message.appendChild(messageIcon);
    message.appendChild(messageTitle);
    message.appendChild(messageDescription);

    const footer = document.createElement('div');
    footer.classList.add('footer');
    footer.dataset.id = '5';
    footer.appendChild(colorsContainer);
    footer.appendChild(message);

    return footer;
  }

  #generateDownload() {
    const messageTitle = document.createElement('div');
    messageTitle.classList.add('title');
    messageTitle.textContent = translations.getStringRef('DOWNLOAD_TITLE');
    const messageDescription = document.createElement('div');
    messageDescription.classList.add('description');
    messageDescription.textContent = translations.getStringRef('DOWNLOAD_DESCRIPTION');
    const message = document.createElement('div');
    message.classList.add('message');
    message.appendChild(messageTitle);
    message.appendChild(messageDescription);

    const files = document.createElement('a');
    files.classList.add('files');
    files.addEventListener('click', () => changelog.init());

    const fromApk = document.createElement('div');
    fromApk.classList.add('from-apk');
    fromApk.appendChild(message);
    fromApk.appendChild(files);

    const separator = document.createElement('div');
    separator.classList.add('separator');

    const storeMessageDescription = document.createElement('div');
    storeMessageDescription.classList.add('description');
    storeMessageDescription.textContent = translations.getStringRef('DOWNLOAD_STORES');
    const storeMessage = document.createElement('div');
    storeMessage.classList.add('message');
    storeMessage.appendChild(storeMessageDescription);

    const stores = document.createElement('div');
    stores.classList.add('stores');
    this.#appendStores(stores);

    const placeholderImage = document.createElement('img');
    placeholderImage.src = 'assets/animations/wavesAnimation.svg';
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.appendChild(placeholderImage);

    const content = document.createElement('div');
    content.classList.add('content', 'unavailable-apk');
    content.appendChild(fromApk);
    content.appendChild(separator);
    content.appendChild(storeMessage);
    content.appendChild(stores);
    content.appendChild(placeholder);

    const downloadContainer = document.createElement('div');
    downloadContainer.classList.add('download');
    downloadContainer.appendChild(content);

    const downloadSection = document.createElement('section');
    downloadSection.id = 'download';
    downloadSection.appendChild(downloadContainer);

    this.#downloadContent = content;
    this.#downloadFiles = files;

    return downloadSection;
  }

  #appendStores(stores) {
    stores.appendChild(this.#generateStore({
      iconUrl: 'assets/stores/appcenter.png',
      id: 'appcenter',
      title: 'AppCenter',
      href: '/ac'
    }));
    stores.appendChild(this.#generateStore({
      iconUrl: 'assets/stores/apkpure.png',
      id: 'apkpure',
      title: 'ApkPure',
      href: '/apkpure'
    }));
    stores.appendChild(this.#generateStore({
      iconUrl: 'assets/stores/apkmirror.png',
      id: 'apkmirror',
      title: 'Apkmirror',
      isUnavailable: true
    }));
    stores.appendChild(this.#generateStore({
      iconUrl: 'assets/stores/playstore.png',
      id: 'playstore',
      title: 'PlayStore',
      isUnavailable: true
    }));
  }

  #generateStore({
    iconUrl,
    id,
    title,
    href,
    isUnavailable = false
  }) {
    const storeIconElement = document.createElement('img');
    storeIconElement.src = iconUrl;
    const storeIconContainer = document.createElement('div');
    storeIconContainer.classList.add('icon', 'need-border');
    storeIconContainer.appendChild(storeIconElement);

    const storeTitle = document.createElement('div');
    storeTitle.classList.add('text');
    storeTitle.textContent = title;

    let store;
    if (isUnavailable) {
      store = document.createElement('div');
      store.classList.add('unavailable');

      const storeDescription = document.createElement('div');
      storeDescription.classList.add('description');
      storeDescription.textContent = translations.getStringRef('DOWNLOAD_UNAVAILABLE');

      const container = document.createElement('div');
      container.classList.add('container');
      container.appendChild(storeDescription);
      container.appendChild(storeTitle);

      store.appendChild(container);
    } else {
      store = document.createElement('a');
      store.href = href;
      store.target = '_blank';

      const animatedIconContainer = document.createElement('div');
      animatedIconContainer.classList.add('access-icon');
      animatedIconContainer.appendChild(storeIconContainer.cloneNode(true));
      
      const continueContainer = document.createElement('div');
      continueContainer.classList.add('continue');
      continueContainer.textContent = translations.getStringRef('DOWNLOAD_AVAILABLE');

      store.appendChild(storeTitle);
      store.appendChild(animatedIconContainer);
      store.appendChild(continueContainer);
    }

    store.classList.add('store');
    store.dataset.id = id;
    store.prepend(storeIconContainer);

    return store;
  }

  #loadVersions() {
    if (typeof this.#precachedResponse != 'undefined') {
      this.#loadVersionsWithResponse(this.#precachedResponse);
    } else {
      const XML = new XMLHttpRequest();
      XML.open('GET', 'https://api.github.com/repos/OctoGramApp/OctoGram/releases?cache='+Math.random().toString(), true);
      XML.send();
      XML.addEventListener('readystatechange', (e) => {
        if (e.target.readyState == 4 && e.target.status == 200) {
          const response = JSON.parse(e.target.responseText);
  
          if (response.length > 0) {
            this.#precachedResponse = response;
            this.#loadVersionsWithResponse(response);
          }
        }
      });
    }
  }

  #loadVersionsWithResponse(response) {
    let selectedRelease = response[0];
    if (selectedRelease['prerelease']) {
      for(const release of response) {
        if (!release['prerelease']) {
          selectedRelease = release;
          break;
        }
      }
    }

    let sizeSum = 0;
    for(const asset of selectedRelease['assets']) {
      sizeSum += asset['size'];
    }
    sizeSum /= selectedRelease['assets'].length;
    
    const fileIcon = document.createElement('img');
    fileIcon.classList.add('icon');
    fileIcon.src = '/assets/icons/file.svg';
    const fileSize = document.createElement('div');
    fileSize.classList.add('size');
    fileSize.innerHTML = utils.calculateSize(sizeSum, true, true).replaceAll(' ', '<br/>');
    const fileIconContainer = document.createElement('div');
    fileIconContainer.classList.add('file-icon-container');
    fileIconContainer.appendChild(fileIcon);
    fileIconContainer.appendChild(fileSize);

    const rightContainerTitle = document.createElement('div');
    rightContainerTitle.classList.add('title');
    rightContainerTitle.textContent = selectedRelease['name'];
    const rightContainerDescription = document.createElement('div');
    rightContainerDescription.classList.add('description');
    rightContainerDescription.textContent = translations.getStringRef('DOWNLOAD_DIRECTLY');
    const rightContainer = document.createElement('div');
    rightContainer.classList.add('right-container');
    rightContainer.appendChild(rightContainerTitle);
    rightContainer.appendChild(rightContainerDescription);

    this.#downloadContent.classList.remove('unavailable-apk');
    this.#downloadFiles.appendChild(fileIconContainer);
    this.#downloadFiles.appendChild(rightContainer);
  }
}

const homePage = new HomePage();