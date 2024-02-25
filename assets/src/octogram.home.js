class HomePage {
  id = 'homePage';

  #precachedResponse;
  #downloadContent;
  #downloadFiles;
  #currentInterval;

  #alreadySignedAnimation = false;

  init() {
    utils.clearPage(this.id, () => this.#destroy());
    window.scrollTo(0, 0);
    document.title = 'OctoGram';
    history.pushState(null, document.title, '/');

    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page');
    pageContainer.appendChild(header.createElement({
      isHomePage: true
    }));
    pageContainer.appendChild(this.#generateIntroduction());
    pageContainer.appendChild(this.#generateFeatures());
    pageContainer.appendChild(this.#generateAdvantages());
    pageContainer.appendChild(this.#generateDownload());
    pageContainer.appendChild(footer.createElement());

    document.body.appendChild(pageContainer);

    this.#loadVersions();
  }

  #destroy() {
    if (typeof this.#currentInterval != 'undefined') {
      clearInterval(this.#currentInterval);
    }
  }

  #generateIntroduction() {
    const patternAnimator = document.createElement('div');
    patternAnimator.classList.add('animator');
    const background = document.createElement('div');
    background.classList.add('background');
    background.appendChild(patternAnimator);

    const stackBg = document.createElement('div');
    stackBg.classList.add('stack');

    const temporaryPlaceholder = document.createElement('div');
    temporaryPlaceholder.classList.add('temporary-placeholder');

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
    const content = document.createElement('div');
    content.classList.add('content');
    content.appendChild(message);

    const introduction = document.createElement('div');
    introduction.classList.add('introduction');
    introduction.appendChild(background);
    introduction.appendChild(stackBg);
    introduction.appendChild(temporaryPlaceholder);

    const updateAfterOnEndAnimation = () => {
      temporaryPlaceholder.remove();
      background.classList.add('enhance');
      stackBg.classList.add('visible');
      introduction.appendChild(content);
    };

    if (this.#alreadySignedAnimation) {
      updateAfterOnEndAnimation();
    } else {
      this.#alreadySignedAnimation = true;
      temporaryPlaceholder.appendChild(this.#generateIntroductionMessage(updateAfterOnEndAnimation));
    }

    return introduction;
  }

  #generateIntroductionMessage(onAnimationEnd) {
    const placeholderString = translations.getStringRef('INTRODUCTION_PLACEHOLDER');

    const chosenUser = Math.floor(Math.random() * 2) + 1;

    const userImage = document.createElement('img');
    userImage.classList.add('image');
    if (chosenUser == 2) {
      userImage.src = 'assets/images/introductionuserimage.2.jpg';
    } else {
      userImage.src = 'assets/images/introductionuserimage.jpg';
    }

    const messageShrinImage = document.createElement('img');
    messageShrinImage.src = 'assets/icons/messageshrin.svg';
    const messageShrin = document.createElement('div');
    messageShrin.classList.add('shrin');
    messageShrin.appendChild(messageShrinImage);
    
    const messageUserName = document.createElement('div');
    messageUserName.classList.add('user-name');
    if (chosenUser == 2) {
      messageUserName.textContent = 'ImØnlyFīrė';
    } else {
      messageUserName.textContent = 'Nick';
    }
    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageText.innerHTML = '&nbsp;';
    const messageContent = document.createElement('div');
    messageContent.appendChild(messageUserName);
    messageContent.appendChild(messageText);

    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble');
    messageBubble.appendChild(messageShrin);
    messageBubble.appendChild(messageContent);

    const message = document.createElement('div');
    message.classList.add('message');
    message.appendChild(userImage);
    message.appendChild(messageBubble);

    requestAnimationFrame(() => {
      messageText.textContent = placeholderString;

      const widthRef = window.innerWidth < 800 ? 100 : 200;
      
      const finalMessageRect = message.getBoundingClientRect();
      const animationDurationSeconds = placeholderString.length * 0.05 + 0.95;
      const maxMultiplier = window.innerWidth / (finalMessageRect.width + widthRef);

      messageText.innerHTML = '&nbsp;';

      let string = '';
      for(const letter of placeholderString) {
        string += letter;
        setTimeout((string) => {
          messageText.textContent = string;
        }, string.length * 50, string);
      }

      message.style.setProperty('--duration', animationDurationSeconds.toString() + 's');
      message.style.setProperty('--multiplier', maxMultiplier);
      message.classList.add('animate');

      message.addEventListener('animationend', () => {
        setTimeout(() => {
          message.classList.remove('animate');
          message.classList.add('disappear');
        
          message.addEventListener('animationend', () => {
            message.remove();
            onAnimationEnd();
          }, { once: true });
        }, 300);
      }, { once: true });
    });

    return message;
  }

  #generateFeatures() {
    const featuresAppName = document.createElement('span');
    featuresAppName.classList.add('appname');
    featuresAppName.textContent = 'OctoGram';
    const featuresTitle = document.createElement('div');
    featuresTitle.classList.add('title');
    featuresTitle.appendChild(translations.getStringRef('FEATURES_TITLE', featuresAppName));

    const list = document.createElement('div');
    list.classList.add('list');
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
        translations.getStringRef('FEATURES_APPEARANCE'),
        [
          [
            'dcid',
            translations.getStringRef('FEATURES_APPEARANCE_DATACENTER_ID'),
            translations.getStringRef('FEATURES_APPEARANCE_DATACENTER_ID_DESCRIPTION')
          ],
          [
            'buttons',
            translations.getStringRef('FEATURES_APPEARANCE_ALTERNATIVE_BUTTONS'),
            translations.getStringRef('FEATURES_APPEARANCE_ALTERNATIVE_BUTTONS_DESCRIPTION')
          ],
          [
            'emojiset',
            translations.getStringRef('FEATURES_APPEARANCE_EMOJI_SET'),
            translations.getStringRef('FEATURES_APPEARANCE_EMOJI_SET_DESCRIPTION')
          ],
        ]
      ],
      [
        translations.getStringRef('FEATURES_FUNCTIONS'),
        [
          [
            'creationdate',
            translations.getStringRef('FEATURES_FUNCTIONS_REGISTRATION_DATE'),
            translations.getStringRef('FEATURES_FUNCTIONS_REGISTRATION_DATE_DESCRIPTION')
          ],
          [
            'details',
            translations.getStringRef('FEATURES_FUNCTIONS_MESSAGE_DETAILS'),
            translations.getStringRef('FEATURES_FUNCTIONS_MESSAGE_DETAILS_DESCRIPTION')
          ],
          [
            'experimental',
            translations.getStringRef('FEATURES_FUNCTIONS_EXPERIMENTAL_FEATURES'),
            translations.getStringRef('FEATURES_FUNCTIONS_EXPERIMENTAL_FEATURES_DESCRIPTION')
          ],
        ]
      ],
      [
        'dcstatus',
        translations.getStringRef('FEATURES_DC_STATUS'),
        translations.getStringRef('FEATURES_DC_STATUS_DESCRIPTION')
      ],
      [
        'doublebottom',
        translations.getStringRef('FEATURES_DOUBLEBOTTOM'),
        translations.getStringRef('FEATURES_DOUBLEBOTTOM_DESCRIPTION')
      ],
    ];

    for(const item of featuresItems) {
      let callbackFunction;
      if (item.length == 2 && typeof item[0] == 'string' && typeof item[1] == 'object') {
        callbackFunction = (...x) => this.#generateFeaturesCarousel(...x);
      } else {
        callbackFunction = (...x) => this.#generateFeaturesItem(...x);
      }

      const { element, onVisible, onHidden } = callbackFunction(...item);

      parallaxHelper.registerForParallax({
        element: element,
        ignoreMobileCheck: true,
        onVisible,
        onHidden
      });

      list.appendChild(element);
    }
  }

  #generateFeaturesCarousel(title, items) {
    let isVisible = false;

    const carouselScrollable = document.createElement('div');
    carouselScrollable.classList.add('scrollable');
    carouselScrollable.style.setProperty('--items', items.length.toString());
    const carousel = document.createElement('div');
    carousel.classList.add('items-carousel');
    carousel.appendChild(carouselScrollable);

    let elementsList = [];
    let activeTabElement;
    let activeTabId;

    const setAsActive = (elementId) => {
      activeTabId = elementId;
      carousel.dataset.enabledId = elementId;
      carouselScrollable.style.setProperty('--translate', (elementId + 1).toString());
    };

    const executeOnVisibleFor = (elementId) => {
      for(const [id, { onVisible }] of elementsList.entries()) {
        if (id == elementId) {
          onVisible();
        }
      }
    };

    const hideAllItems = () => {
      for(const { onHidden } of elementsList) {
        onHidden();
      }
    };

    for(const item of items) {
      const { element, onVisible, onHidden } = this.#generateFeaturesItem(...item);
      carouselScrollable.appendChild(element);
      elementsList.push({ element, onVisible, onHidden });
    }

    const carouselTitle = document.createElement('div');
    carouselTitle.classList.add('title');
    carouselTitle.textContent = title.toUpperCase();
    const carouselTabs = document.createElement('div');
    carouselTabs.classList.add('tabs');
    carouselTabs.appendChild(carouselTitle);
    for(const [id, item] of items.entries()) {
      const tab = document.createElement('div');
      tab.classList.add('tab');
      tab.addEventListener('click', () => {
        if (activeTabId != id) {
          if (typeof activeTabElement != 'undefined') {
            activeTabElement.classList.remove('active');
          }
  
          activeTabElement = tab;
          tab.classList.add('active');
          setAsActive(id);
  
          if (isVisible) {
            hideAllItems();
            executeOnVisibleFor(id);
          }
        }
      });
      tab.textContent = item[1];
      carouselTabs.appendChild(tab);

      if (!id) {
        activeTabElement = tab;
        tab.classList.add('active');
        setAsActive(0);
      }
    }

    carousel.prepend(carouselTabs);

    return {
      element: carousel,
      onVisible: () => {
        if (!isVisible) {
          isVisible = true;
          executeOnVisibleFor(activeTabId);
        }
      },
      onHidden: () => {
        if (isVisible) {
          isVisible = false;
          hideAllItems();
        }
      }
    };
  }

  #generateFeaturesItem(id, title, description) {
    let isVisible = false;

    const imageElement = document.createElement('img');
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image');
    imageContainer.appendChild(imageElement);

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('title');
    titleContainer.textContent = title;
    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('description');
    descriptionContainer.textContent = description;
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('item-message');
    messageContainer.appendChild(titleContainer);
    messageContainer.appendChild(descriptionContainer);

    const item = document.createElement('div');
    item.classList.add('item');
    item.dataset.id = id;
    item.appendChild(imageContainer);
    item.appendChild(messageContainer);

    const { startAnimation, stopAnimation, enhanceAnimation } = this.#initDecorationAnimation(item, imageContainer, id);
    this.#appendDecoration(imageContainer, imageElement, id, enhanceAnimation);

    let videoItem;
    if (id == 'doublebottom') {
      videoItem = document.createElement('video');
      videoItem.classList.toggle('prep-animation');
      videoItem.toggleAttribute('disablepictureinpicture');
      videoItem.toggleAttribute('disableremoteplayback');
      videoItem.toggleAttribute('playsinline');
      videoItem.setAttribute('muted', 'true');
      videoItem.setAttribute('x-webkit-airplay', 'deny');
      videoItem.src = '/assets/animations/touchclickdb.mp4';
      item.appendChild(videoItem);
      
      item.classList.add('has-custom-video');
      videoItem.addEventListener('play', () => {
        item.classList.remove('animation-completed');
        videoItem.classList.remove('hidden');
      });
      videoItem.addEventListener('ended', () => {
        item.classList.add('animation-completed');
        videoItem.classList.add('hidden');
        startAnimation();
        enhanceAnimation();
        
        descriptionContainer.innerHTML = utils.generateRandomEncrScript(description.length, true);
        for(let i = 0; i <= description.length; i++) {
          setTimeout(() => {
            descriptionContainer.textContent = description.slice(0, i);
            descriptionContainer.innerHTML += ' ' + utils.generateRandomEncrScript(description.length - i, true);
          }, 10 * i);
        }
      });
    }

    return {
      element: item,
      onVisible: () => {
        if (!isVisible) {
          isVisible = true;
          
          if (typeof videoItem == 'undefined') {
            startAnimation();
          } else {
            videoItem.pause();
            videoItem.currentTime = 1;
            videoItem.play();
          }
        }
      },
      onHidden: () => {
        if (isVisible) {
          isVisible = false;
          stopAnimation();

          descriptionContainer.textContent = description;
          
          if (typeof videoItem != 'undefined') {
            videoItem.pause();
          }
        }
      }
    };
  }

  #appendDecoration(imageContainer, imageElement, id, enhanceAnimationInstance) {
    switch (id) {
      case 'dcid':
        imageElement.src = 'assets/images/features.dcid.octogram.jpg';

        const secondaryImageItem = document.createElement('img');
        secondaryImageItem.src = 'assets/images/features.dcid.telegram.jpg';
        imageContainer.appendChild(secondaryImageItem);
        
        const switchableRowText = document.createElement('span');
        switchableRowText.textContent = translations.getStringRef('FEATURES_APPEARANCE_DATACENTER_ID_SWITCH');
        const switchableRowCheckbox = document.createElement('div');
        switchableRowCheckbox.classList.add('checkbox');
        const switchableRowContent = document.createElement('div');
        switchableRowContent.classList.add('switchable-row-content');
        switchableRowContent.appendChild(switchableRowText);
        switchableRowContent.appendChild(switchableRowCheckbox);
        const switchableRow = document.createElement('div');
        switchableRow.classList.add('switchable-row');
        switchableRow.addEventListener('click', () => {
          const state = switchableRow.classList.toggle('is-checked');
          secondaryImageItem.classList.toggle('active', state);

          if (typeof enhanceAnimationInstance == 'function') {
            enhanceAnimationInstance();
          }
        });
        switchableRow.appendChild(switchableRowContent);

        imageContainer.appendChild(switchableRow);
      break;
      case 'unavailable.feature':
      case 'buttons':
        imageElement.src = 'assets/images/unavailable.feature.jpg';

        const unavailableFeatureImage = document.createElement('img');
        unavailableFeatureImage.classList.add('icon');
        unavailableFeatureImage.src = 'assets/icons/personrunning.svg';
        const unavailableFeatureText = document.createElement('div');
        unavailableFeatureText.classList.add('text');
        unavailableFeatureText.textContent = translations.getStringRef('FEATURES_UNAVAILABLE');
        const unavailableFeature = document.createElement('div');
        unavailableFeature.classList.add('unavailable');
        unavailableFeature.appendChild(unavailableFeatureImage);
        unavailableFeature.appendChild(unavailableFeatureText);

        imageContainer.appendChild(unavailableFeature);
      break;
      case 'details':
        imageElement.src = 'assets/images/features.details.jpg';
      break;
      case 'emojiset':
        imageElement.src = 'assets/images/features.emojiset.jpg';
      break;
      case 'dcstatus':
        imageElement.src = 'assets/images/features.dcstatus.jpg';
      break;
      case 'creationdate':
        imageElement.src = 'assets/images/features.creationdate.jpg';
      break;
      case 'experimental':
        imageElement.src = 'assets/images/features.experimental.jpg';
      break;
      case 'doublebottom':
        imageElement.src = 'assets/images/features.doublebottom.jpg';
      break;
    }
  }

  #getAnimationDataForDecoration(id) {
    let iconNames = [];
    switch(id) {
      case 'dcid':
        iconNames.push('assets/icons/server.svg');
        iconNames.push('assets/icons/comments.svg');
        iconNames.push('assets/icons/explosion.svg');
        iconNames.push('assets/icons/microphone.svg');
        iconNames.push('assets/icons/star.svg');
        iconNames.push('assets/icons/datacenters/dc1.svg');
      break;
      case 'buttons':
        for(let i = 0; i < 8; i++) {
          iconNames.push('assets/icons/star.svg');
        }
      break;
      case 'emojiset':
        iconNames.push('assets/icons/faceheart.svg');
        iconNames.push('assets/icons/facekiss.svg');
        iconNames.push('assets/icons/facelaughsquint.svg');
        iconNames.push('assets/icons/facerollingeyes.svg');
        iconNames.push('assets/icons/facesmile.svg');
        iconNames.push('assets/icons/settings.svg');
      break;
      case 'dcstatus':
        iconNames.push('assets/icons/server.svg');
        iconNames.push('assets/icons/datacenters/dc1.svg');
        iconNames.push('assets/icons/datacenters/dc2.svg');
        iconNames.push('assets/icons/datacenters/dc3.svg');
        iconNames.push('assets/icons/datacenters/dc4.svg');
        iconNames.push('assets/icons/datacenters/dc5.svg');
      break;
      case 'creationdate':
        iconNames.push('assets/icons/calendardays.svg');
        iconNames.push('assets/icons/clock.svg');
        iconNames.push('assets/icons/usersecret.svg');
        iconNames.push('assets/icons/microphone.svg');
      break;
      case 'details':
        iconNames.push('assets/icons/info.svg');
        iconNames.push('assets/icons/comments.svg');
        iconNames.push('assets/icons/reply.svg');
        iconNames.push('assets/icons/settings.svg');
        iconNames.push('assets/icons/download.svg');
        iconNames.push('assets/icons/microphone.svg');
      break;
      case 'experimental':
        iconNames.push('assets/icons/flask.svg');
        iconNames.push('assets/icons/dev.svg');
        iconNames.push('assets/icons/terminal.svg');
        iconNames.push('assets/icons/settings.svg');
        iconNames.push('assets/icons/usersecret.svg');
        iconNames.push('assets/icons/server.svg');
      break;
      case 'doublebottom':
        iconNames.push('assets/icons/explosion.svg');
        iconNames.push('assets/icons/star.svg');
        iconNames.push('assets/icons/clock.svg');
        iconNames.push('assets/icons/terminal.svg');
        iconNames.push('assets/icons/settings.svg');
        iconNames.push('assets/icons/usersecret.svg');
      break;
    }

    return iconNames;
  }

  #initDecorationAnimation(container, startElement, id) {
    const ANIMATION_ICON_NAMES = this.#getAnimationDataForDecoration(id);

    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');

    let availableSlots = [];
    for(let i = 0; i < 3; i++){
      for(const iconUrl of ANIMATION_ICON_NAMES) {
        const animatedElement = document.createElement('img');
        animatedElement.classList.add('animated-icon');
        animatedElement.addEventListener('animationend', () => {
          animatedElement.classList.remove('animated');
        });
        animatedElement.src = iconUrl;
        placeholder.appendChild(animatedElement);
        availableSlots.push(animatedElement);
      }
    }

    container.prepend(placeholder);

    let rightCounter = 0;
    let isAnimationEnhanceInProgress = false;
    let currentInterval;

    const animateElement = (element, startElementRect, containerRect) => {
      let xPosition;
      if (rightCounter > 2) {
        rightCounter = 0;

        const maximumXPosition = startElementRect.left - containerRect.left;
        xPosition = Math.floor(Math.random() * maximumXPosition);
      } else {
        rightCounter++;

        const minimumXPosition = startElementRect.left + startElementRect.width - containerRect.left;
        const maximumXPosition = containerRect.width - minimumXPosition;
        xPosition = Math.floor(Math.random() * (maximumXPosition - minimumXPosition)) + minimumXPosition;
      }

      const yPosition = Math.floor(Math.random() * containerRect.height);

      const startFromPositionX = startElementRect.left - containerRect.left + startElementRect.width / 2;
      const startFromPositionY = startElementRect.top - containerRect.top + startElementRect.height / 2;

      element.style.setProperty('--start-from-x', startFromPositionX);
      element.style.setProperty('--start-from-y', startFromPositionY);
      element.style.setProperty('--arrive-to-y', yPosition);
      element.style.setProperty('--arrive-to-x', xPosition);
      element.classList.add('animated');
    };
    
    return {
      startAnimation: () => {
        if (typeof currentInterval != 'undefined') {
          clearInterval(currentInterval);
        }

        currentInterval = setInterval(() => {
          if (!document.hasFocus()) {
            return;
          }

          const startElementRect = startElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
    
          for(const element of availableSlots) {
            if (!element.classList.contains('animated')) {    
              animateElement(element, startElementRect, containerRect);
              break;
            }
          }
        }, 300);
      },
      enhanceAnimation: () => {
        if (!isAnimationEnhanceInProgress) {
          isAnimationEnhanceInProgress = true;

          const startElementRect = startElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          let temporarySlots = [];
          let removedItems = 0;
          for(let i = 0; i < 5; i++){
            for(const iconUrl of ANIMATION_ICON_NAMES) {
              const animatedElement = document.createElement('img');
              animatedElement.classList.add('animated-icon');
              animatedElement.addEventListener('animationend', () => {
                animatedElement.classList.remove('animated');
                setTimeout(() => {
                  animatedElement.remove();
                  removedItems++;

                  if (removedItems == temporarySlots.length) {
                    isAnimationEnhanceInProgress = false;
                  }
                }, 200);
              });
              animatedElement.src = iconUrl;
              placeholder.appendChild(animatedElement);
              temporarySlots.push(animatedElement);
            }
          }
    
          for(const element of temporarySlots) {
            animateElement(element, startElementRect, containerRect);
          }
        }
      },
      stopAnimation: () => {
        if (typeof currentInterval != 'undefined') {
          clearInterval(currentInterval);
        }

        rightCounter = 0;
      }
    };
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
      'assets/animations/updatedAnimation.gif',
      translations.getStringRef('ADVANTAGES_ROWS_1_TITLE'),
      translations.getStringRef('ADVANTAGES_ROWS_1_DESCRIPTION')
    ));
    list.appendChild(this.#generateAdvantagesSeparator());
    list.appendChild(this.#generateAdvantagesItem(
      'assets/animations/tosCompliantAnimation.gif',
      translations.getStringRef('ADVANTAGES_ROWS_2_TITLE'),
      translations.getStringRef('ADVANTAGES_ROWS_2_DESCRIPTION')
    ));
    list.appendChild(this.#generateAdvantagesSeparator());
    list.appendChild(this.#generateAdvantagesItem(
      'assets/animations/themeAnimation.gif',
      translations.getStringRef('ADVANTAGES_ROWS_3_TITLE'),
      translations.getStringRef('ADVANTAGES_ROWS_3_DESCRIPTION')
    ));
  }

  #generateAdvantagesSeparator() {
    const separator = document.createElement('div');
    separator.classList.add('separator');
    return separator;
  }

  #generateAdvantagesItem(imageUrl, title, description) {
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    const titleContainer = document.createElement('div');
    titleContainer.classList.add('title');
    titleContainer.textContent = title;
    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('description');
    descriptionContainer.textContent = description;
    const item = document.createElement('div');
    item.classList.add('item');
    item.appendChild(imageElement);
    item.appendChild(titleContainer);
    item.appendChild(descriptionContainer);
    return item;
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