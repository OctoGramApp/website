class HomePage {
  init() {
    utils.clearPage('home');

    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page');
    pageContainer.appendChild(header.createElement());
    pageContainer.appendChild(this.#generateIntroduction());
    pageContainer.appendChild(this.#generateFeatures());
    pageContainer.appendChild(this.#generateAdvantages());
    pageContainer.appendChild(this.#generateMonet());
    pageContainer.appendChild(footer.createElement());

    document.body.appendChild(pageContainer);
  }

  #generateIntroduction() {
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');

    // TODO: manage messageTitle

    const messageTitleClient = document.createElement('span');
    messageTitleClient.classList.add('appname');
    messageTitleClient.textContent = 'OctoGram';
    const messageTitle = document.createElement('div');
    messageTitle.classList.add('title');
    messageTitle.appendChild(document.createTextNode(translations.getStringRef('INTRODUCTION_DISCOVER') + ' '));
    messageTitle.appendChild(messageTitleClient);
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
    featuresTitle.textContent = translations.getStringRef('FEATURES_TITLE').replace('%s', '');
    if (translations.getStringRef('FEATURES_TITLE').indexOf('%s') == 0) {
      featuresTitle.prepend(featuresAppName);
    } else {
      featuresTitle.appendChild(featuresAppName);
    }

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
    messageTitle.textContent = translations.getStringRef('ADVANTAGES_TITLE');
    const messageDescription = document.createElement('div');
    messageDescription.classList.add('description');
    messageDescription.textContent = translations.getStringRef('ADVANTAGES_DESCRIPTION');
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
        translations.getStringRef('MONET_TRY')
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
}

const homePage = new HomePage();