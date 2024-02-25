class Monet {
  id = 'monet';

  init() {
    utils.clearPage(this.id);
    window.scrollTo(0, 0);
    document.title = 'OctoGram - ' + translations.getStringRef('MONET_TITLE_PAGE');
    history.pushState(null, document.title, '/monet');

    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page');
    pageContainer.appendChild(header.createElement({
      onBackCallback: () => homePage.init()
    }));
    pageContainer.appendChild(this.#generatePointer());
    pageContainer.appendChild(this.#generateMonet());
    pageContainer.appendChild(footer.createElement());

    document.body.appendChild(pageContainer);
    parallaxHelper.handle();
  }

  #generatePointer() {
    const stickerImage = document.createElement('img');
    stickerImage.src = 'assets/animations/themeAnimation.gif';
    const stickerContainer = document.createElement('div');
    stickerContainer.classList.add('sticker');
    stickerContainer.appendChild(stickerImage);
    const messageTitle = document.createElement('div');
    messageTitle.classList.add('title');
    messageTitle.textContent = translations.getStringRef('MONET_PAGE_DESCRIPTION');

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
}

const monet = new Monet();