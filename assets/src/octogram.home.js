import {calculateSize, clearPage, generateRandomEncrScript} from "./octogram.utils.js";
import * as header from "./octogram.header.js";
import {getStringRef} from "./octogram.translations.js";
import * as footer from "./octogram.footer.js";
import * as parallaxHelper from "./octogram.parallax.js";
import * as changelog from "./octogram.changelog.js";

const id = 'homePage';

let precachedResponse;
let downloadContent;
let downloadFiles;
let currentInterval;

let alreadySignedAnimation = false;

function init() {
  clearPage(id, () => destroy());
  window.scrollTo(0, 0);
  document.title = 'OctoGram';
  history.pushState(null, document.title, '/');

  const pageContainer = document.createElement('div');
  pageContainer.classList.add('page');
  pageContainer.appendChild(header.createElement({
    isHomePage: true
  }));
  pageContainer.appendChild(generateIntroduction());
  pageContainer.appendChild(generateFeatures());
  pageContainer.appendChild(generateAdvantages());
  pageContainer.appendChild(generateDownload());
  pageContainer.appendChild(footer.createElement());

  document.body.appendChild(pageContainer);

  loadVersions();
}

function destroy() {
  if (typeof currentInterval != 'undefined') {
    clearInterval(currentInterval);
  }
}

function generateIntroduction() {
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
  messageTitle.appendChild(getStringRef('INTRODUCTION_DISCOVER', messageTitleClient));
  const messageDescription = document.createElement('div');
  messageDescription.classList.add('description');
  messageDescription.textContent = getStringRef('INTRODUCTION_DISCOVER_DESCRIPTION');
  const message = document.createElement('div');
  message.classList.add('message');
  message.appendChild(messageTitle);
  message.appendChild(messageDescription);
  const content = document.createElement('div');
  content.classList.add('content');
  content.appendChild(message);

  const pageScrolling = document.createElement('img');
  pageScrolling.classList.add('scrolling');
  pageScrolling.src = '/assets/icons/arrowright.svg';

  const introduction = document.createElement('div');
  introduction.classList.add('introduction');
  introduction.appendChild(background);
  introduction.appendChild(stackBg);
  introduction.appendChild(temporaryPlaceholder);
  introduction.appendChild(pageScrolling);

  const updateAfterOnEndAnimation = () => {
    temporaryPlaceholder.remove();
    background.classList.add('enhance');
    stackBg.classList.add('visible');
    introduction.appendChild(content);
  };

  if (alreadySignedAnimation) {
    updateAfterOnEndAnimation();
  } else {
    alreadySignedAnimation = true;
    temporaryPlaceholder.appendChild(generateIntroductionMessage(updateAfterOnEndAnimation));
  }

  return introduction;
}

function generateIntroductionMessage(onAnimationEnd) {
  const placeholderString = getStringRef('INTRODUCTION_PLACEHOLDER');

  const chosenUser = Math.floor(Math.random() * 2) + 1;

  const userImage = document.createElement('img');
  userImage.classList.add('image');
  if (chosenUser === 2) {
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
  if (chosenUser === 2) {
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
    message.style.setProperty('--multiplier', String(maxMultiplier));
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

function generateFeatures() {
  const featuresAppName = document.createElement('span');
  featuresAppName.classList.add('appname');
  featuresAppName.textContent = 'OctoGram';
  const featuresTitle = document.createElement('div');
  featuresTitle.classList.add('title');
  featuresTitle.appendChild(getStringRef('FEATURES_TITLE', featuresAppName));

  const list = document.createElement('div');
  list.classList.add('list');
  appendFeaturesItems(list);

  const featuresContainer = document.createElement('div');
  featuresContainer.classList.add('features');
  featuresContainer.appendChild(featuresTitle);
  featuresContainer.appendChild(list);

  const featuresSection = document.createElement('section');
  featuresSection.id = 'features';
  featuresSection.appendChild(featuresContainer);

  return featuresSection;
}

function appendFeaturesItems(list) {
  const featuresItems = [
    [
      getStringRef('FEATURES_APPEARANCE'),
      [
        [
          'dcid',
          getStringRef('FEATURES_APPEARANCE_DATACENTER_ID'),
          getStringRef('FEATURES_APPEARANCE_DATACENTER_ID_DESCRIPTION')
        ],
        [
          'buttons',
          getStringRef('FEATURES_APPEARANCE_ALTERNATIVE_BUTTONS'),
          getStringRef('FEATURES_APPEARANCE_ALTERNATIVE_BUTTONS_DESCRIPTION')
        ],
        [
          'emojiset',
          getStringRef('FEATURES_APPEARANCE_EMOJI_SET'),
          getStringRef('FEATURES_APPEARANCE_EMOJI_SET_DESCRIPTION')
        ],
      ]
    ],
    [
      getStringRef('FEATURES_FUNCTIONS'),
      [
        [
          'creationdate',
          getStringRef('FEATURES_FUNCTIONS_REGISTRATION_DATE'),
          getStringRef('FEATURES_FUNCTIONS_REGISTRATION_DATE_DESCRIPTION')
        ],
        [
          'details',
          getStringRef('FEATURES_FUNCTIONS_MESSAGE_DETAILS'),
          getStringRef('FEATURES_FUNCTIONS_MESSAGE_DETAILS_DESCRIPTION')
        ],
        [
          'experimental',
          getStringRef('FEATURES_FUNCTIONS_EXPERIMENTAL_FEATURES'),
          getStringRef('FEATURES_FUNCTIONS_EXPERIMENTAL_FEATURES_DESCRIPTION')
        ],
      ]
    ],
    [
      'dcstatus',
      getStringRef('FEATURES_DC_STATUS'),
      getStringRef('FEATURES_DC_STATUS_DESCRIPTION')
    ],
    [
      'doublebottom',
      getStringRef('FEATURES_DOUBLEBOTTOM'),
      getStringRef('FEATURES_DOUBLEBOTTOM_DESCRIPTION')
    ],
  ];

  for(const item of featuresItems) {
    let callbackFunction;
    if (item.length === 2 && typeof item[0] == 'string' && typeof item[1] == 'object') {
      callbackFunction = (...x) => generateFeaturesCarousel(...x);
    } else {
      callbackFunction = (...x) => generateFeaturesItem(...x);
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

function generateFeaturesCarousel(title, items) {
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
      if (id === elementId) {
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
    const { element, onVisible, onHidden } = generateFeaturesItem(...item);
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
      if (activeTabId !== id) {
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

function generateFeaturesItem(id, title, description) {
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

  const { startAnimation, stopAnimation, enhanceAnimation } = initDecorationAnimation(item, imageContainer, id);
  appendDecoration(imageContainer, imageElement, id, enhanceAnimation);

  let videoItem;
  if (id === 'doublebottom') {
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

      descriptionContainer.innerHTML = generateRandomEncrScript(description.length, true);
      for(let i = 0; i <= description.length; i++) {
        setTimeout(() => {
          descriptionContainer.textContent = description.slice(0, i);
          descriptionContainer.innerHTML += ' ' + generateRandomEncrScript(description.length - i, true);
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

function appendDecoration(imageContainer, imageElement, id, enhanceAnimationInstance) {
  switch (id) {
    case 'dcid':
      imageElement.src = 'assets/images/features.dcid.octogram.jpg';

      const secondaryImageItem = document.createElement('img');
      secondaryImageItem.src = 'assets/images/features.dcid.telegram.jpg';
      imageContainer.appendChild(secondaryImageItem);

      const switchableRowText = document.createElement('span');
      switchableRowText.textContent = getStringRef('FEATURES_APPEARANCE_DATACENTER_ID_SWITCH');
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
      unavailableFeatureText.textContent = getStringRef('FEATURES_UNAVAILABLE');
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

function getAnimationDataForDecoration(id) {
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

function initDecorationAnimation(container, startElement, id) {
  const ANIMATION_ICON_NAMES = getAnimationDataForDecoration(id);

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

    element.style.setProperty('--start-from-x', String(startFromPositionX));
    element.style.setProperty('--start-from-y', String(startFromPositionY));
    element.style.setProperty('--arrive-to-y', String(yPosition));
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

                if (removedItems === temporarySlots.length) {
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

function generateAdvantages() {
  const messageTitle = document.createElement('div');
  messageTitle.classList.add('title');
  messageTitle.textContent = getStringRef('ADVANTAGES_TITLE');
  const messageDescription = document.createElement('div');
  messageDescription.classList.add('description');
  messageDescription.textContent = getStringRef('ADVANTAGES_DESCRIPTION');
  const message = document.createElement('div');
  message.classList.add('message');
  message.appendChild(messageTitle);
  message.appendChild(messageDescription);

  const items = document.createElement('div');
  items.classList.add('items');
  appendAdvantagesItems(items);

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

function appendAdvantagesItems(list) {
  list.appendChild(generateAdvantagesItem(
    'assets/animations/updatedAnimation.gif',
    getStringRef('ADVANTAGES_ROWS_1_TITLE'),
    getStringRef('ADVANTAGES_ROWS_1_DESCRIPTION')
  ));
  list.appendChild(generateAdvantagesSeparator());
  list.appendChild(generateAdvantagesItem(
    'assets/animations/tosCompliantAnimation.gif',
    getStringRef('ADVANTAGES_ROWS_2_TITLE'),
    getStringRef('ADVANTAGES_ROWS_2_DESCRIPTION')
  ));
  list.appendChild(generateAdvantagesSeparator());
  list.appendChild(generateAdvantagesItem(
    'assets/animations/themeAnimation.gif',
    getStringRef('ADVANTAGES_ROWS_3_TITLE'),
    getStringRef('ADVANTAGES_ROWS_3_DESCRIPTION')
  ));
}

function generateAdvantagesSeparator() {
  const separator = document.createElement('div');
  separator.classList.add('separator');
  return separator;
}

function generateAdvantagesItem(imageUrl, title, description) {
  const imageElement = document.createElement('img');
  imageElement.src = imageUrl;
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('title');
  titleContainer.textContent = title;
  const descriptionContainer = document.createElement('div');
  descriptionContainer.classList.add('description');
  descriptionContainer.textContent = description;
  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container');
  textContainer.appendChild(titleContainer);
  textContainer.appendChild(descriptionContainer);
  const item = document.createElement('div');
  item.classList.add('item');
  item.appendChild(imageElement);
  item.appendChild(textContainer);
  return item;
}

function generateDownload() {
  const messageTitle = document.createElement('div');
  messageTitle.classList.add('title');
  messageTitle.textContent = getStringRef('DOWNLOAD_TITLE');
  const messageDescription = document.createElement('div');
  messageDescription.classList.add('description');
  messageDescription.textContent = getStringRef('DOWNLOAD_DESCRIPTION');
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
  storeMessageDescription.textContent = getStringRef('DOWNLOAD_STORES');
  const storeMessage = document.createElement('div');
  storeMessage.classList.add('message');
  storeMessage.appendChild(storeMessageDescription);

  const stores = document.createElement('div');
  stores.classList.add('stores');
  appendStores(stores);

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

  downloadContent = content;
  downloadFiles = files;

  return downloadSection;
}

function appendStores(stores) {
  stores.appendChild(generateStore({
    iconUrl: 'assets/stores/appcenter.png',
    id: 'appcenter',
    title: 'AppCenter',
    href: '/ac'
  }));
  stores.appendChild(generateStore({
    iconUrl: 'assets/stores/apkpure.png',
    id: 'apkpure',
    title: 'ApkPure',
    href: '/apkpure'
  }));
  stores.appendChild(generateStore({
    iconUrl: 'assets/stores/apkmirror.png',
    id: 'apkmirror',
    title: 'Apkmirror',
    isUnavailable: true
  }));
  stores.appendChild(generateStore({
    iconUrl: 'assets/stores/playstore.png',
    id: 'playstore',
    title: 'PlayStore',
    isUnavailable: true
  }));
}

function generateStore({
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
    storeDescription.textContent = getStringRef('DOWNLOAD_UNAVAILABLE');

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
    continueContainer.textContent = getStringRef('DOWNLOAD_AVAILABLE');

    store.appendChild(storeTitle);
    store.appendChild(animatedIconContainer);
    store.appendChild(continueContainer);
  }

  store.classList.add('store');
  store.dataset.id = id;
  store.prepend(storeIconContainer);

  return store;
}

function loadVersions() {
  if (typeof precachedResponse != 'undefined') {
    loadVersionsWithResponse(precachedResponse);
  } else {
    const XML = new XMLHttpRequest();
    XML.open('GET', 'https://api.github.com/repos/OctoGramApp/OctoGram/releases?cache='+Math.random().toString(), true);
    XML.send();
    XML.addEventListener('readystatechange', (e) => {
      if (e.target.readyState === 4 && e.target.status === 200) {
        const response = JSON.parse(e.target.responseText);

        if (response.length > 0) {
          precachedResponse = response;
          loadVersionsWithResponse(response);
        }
      }
    });
  }
}

function loadVersionsWithResponse(response) {
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
  fileSize.innerHTML = calculateSize(sizeSum, true, true).replaceAll(' ', '<br/>');
  const fileIconContainer = document.createElement('div');
  fileIconContainer.classList.add('file-icon-container');
  fileIconContainer.appendChild(fileIcon);
  fileIconContainer.appendChild(fileSize);

  const rightContainerTitle = document.createElement('div');
  rightContainerTitle.classList.add('title');
  rightContainerTitle.textContent = selectedRelease['name'];
  const rightContainerDescription = document.createElement('div');
  rightContainerDescription.classList.add('description');
  rightContainerDescription.textContent = getStringRef('DOWNLOAD_DIRECTLY');
  const rightContainer = document.createElement('div');
  rightContainer.classList.add('right-container');
  rightContainer.appendChild(rightContainerTitle);
  rightContainer.appendChild(rightContainerDescription);

  downloadContent.classList.remove('unavailable-apk');
  downloadFiles.appendChild(fileIconContainer);
  downloadFiles.appendChild(rightContainer);
}

export {
  id,
  init,
};