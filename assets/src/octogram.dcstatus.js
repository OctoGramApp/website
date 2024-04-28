import * as footer from "./octogram.footer.js";
import * as homePage from "./octogram.home.js";
import * as header from "./octogram.header.js";
import * as mtProtoHelper from "./octogram.mtproto.js";
import * as requestsManager from "./octogram.requests.js";
import {getStringRef} from "./octogram.translations.js";
import * as config from "./octogram.dcstatus.config.js";
import {clearPage, formatDate, getEmojiByIso2, parseCustomSelectMenu} from "./octogram.utils";

const id = 'dcStatus';

const CANVAS_DRAWDCSTATE = [
  { x: 36.6 },
  { x: 412.4 },
  { x: 784.8 },
  { x: 1157.3 },
  { x: 1529.9 },
];
const CANVAS_CONTAINERWIDTH = 356.8;
const CANVAS_BADGEWIDTH = 270;
const CANVAS_BADGEHEIGHT = 60;
const CANVAS_BADGEY = 605.3;

const DATACENTER_COUNT = 5;
let currentTimeout;
let currentInterval;
let lastBackendLoadTime;
let isLoading = false;
let availableSlots = [];

let secondsIndicator;
let cardDescription;

let identifyCardSelector;
let identifyCardContent;
let identifyCardContainer;

function init() {
  clearPage(id, () => destroy());
  window.scrollTo(0, 0);
  document.title = 'OctoGram - ' + getStringRef('DCSTATUS_TITLE_PAGE');
  history.pushState(null, document.title, '/dcstatus');

  availableSlots = [];

  const pageContainer = document.createElement('div');
  pageContainer.classList.add('page');
  pageContainer.appendChild(header.createElement({
    onBackCallback: () => homePage.init()
  }));
  pageContainer.appendChild(generatePointer());
  pageContainer.appendChild(generateIdentifyDcContainer());
  pageContainer.appendChild(generateServerContainer());
  pageContainer.appendChild(generateExportContainer());
  pageContainer.appendChild(footer.createElement());

  document.body.appendChild(pageContainer);

  initLoading();
}

function destroy() {
  if (typeof currentTimeout != 'undefined') {
    clearTimeout(currentTimeout);
  }

  if (typeof currentInterval != 'undefined') {
    clearInterval(currentInterval);
  }

  mtProtoHelper.killDatacenterConnection();
}

function generatePointer() {
  const stickerImage = document.createElement('img');
  stickerImage.src = 'assets/animations/dcstatusAnimation.gif';
  const stickerContainer = document.createElement('div');
  stickerContainer.classList.add('sticker');
  stickerContainer.appendChild(stickerImage);
  const messageTitle = document.createElement('div');
  messageTitle.classList.add('title');
  messageTitle.textContent = getStringRef('DCSTATUS_TITLE');
  const messageButton = document.createElement('div');
  messageButton.classList.add('button', 'accent');
  messageButton.addEventListener('click', () => executeForceReload());
  messageButton.textContent = getStringRef('DCSTATUS_BUTTON');

  const message = document.createElement('div');
  message.classList.add('message');
  message.appendChild(stickerContainer);
  message.appendChild(messageTitle);
  message.appendChild(messageButton);

  const content = document.createElement('div');
  content.classList.add('content');
  content.appendChild(message);

  const pointer = document.createElement('div');
  pointer.classList.add('pointer');
  pointer.appendChild(content);

  return pointer;
}

function generateServerContainer() {
  const title = document.createElement('div');
  title.classList.add('title');
  title.textContent = getStringRef('DCSTATUS_SERVER_TITLE');

  const descriptionPendingSeconds = document.createElement('span');
  descriptionPendingSeconds.classList.add('seconds');
  descriptionPendingSeconds.textContent = '29';
  const descriptionPending = document.createElement('div');
  descriptionPending.classList.add('pending');
  descriptionPending.textContent = getStringRef('DCSTATUS_SERVER_DESCRIPTION') + ' ';
  descriptionPending.appendChild(descriptionPendingSeconds);
  const loadingCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  loadingCircle.setAttributeNS(null, 'cx', '10');
  loadingCircle.setAttributeNS(null, 'cy', '10');
  loadingCircle.setAttributeNS(null, 'r', '8');
  loadingCircle.setAttributeNS(null, 'stroke-linecap', 'round');
  const loadingSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  loadingSvg.appendChild(loadingCircle);
  const description = document.createElement('div');
  description.classList.add('description');
  description.appendChild(descriptionPending);
  description.appendChild(loadingSvg);

  const descriptor = document.createElement('div');
  descriptor.classList.add('descriptor');
  descriptor.appendChild(title);
  descriptor.appendChild(description);

  const datacenters = document.createElement('div');
  datacenters.classList.add('datacenters');
  appendDatacenters(datacenters);

  const content = document.createElement('div');
  content.classList.add('content');
  content.appendChild(descriptor);
  content.appendChild(datacenters);
  const card = document.createElement('div');
  card.classList.add('card', 'server');
  card.appendChild(content);

  secondsIndicator = descriptionPendingSeconds;
  cardDescription = description;

  return card;
}

function appendDatacenters(datacenters) {
  let currentActiveRow;

  const datacentersFragment = document.createDocumentFragment();

  for (let i = 1; i <= DATACENTER_COUNT; i++) {
    const datacenterBackground = document.createElement('div');
    datacenterBackground.classList.add('background');
    const datacenterIcon = document.createElement('img');
    datacenterIcon.src = 'assets/icons/datacenters/dc' + String(i) + '.svg';

    const circleItem = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleItem.setAttributeNS(null, 'cx', '50%');
    circleItem.setAttributeNS(null, 'cy', '50%');
    circleItem.setAttributeNS(null, 'r', '22');
    circleItem.setAttributeNS(null, 'fill', 'none');
    const loaderSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    loaderSvg.setAttributeNS(null, 'width', '50');
    loaderSvg.setAttributeNS(null, 'height', '50');
    loaderSvg.appendChild(circleItem);

    const datacenterIconContainer = document.createElement('div');
    datacenterIconContainer.classList.add('icon', 'is-loading');
    datacenterIconContainer.appendChild(datacenterBackground);
    datacenterIconContainer.appendChild(datacenterIcon);
    datacenterIconContainer.appendChild(loaderSvg);

    const datacenterName = document.createElement('div');
    datacenterName.classList.add('name');
    datacenterName.textContent = config.DATACENTER_NAMES[i - 1];
    const datacenterStatus = composeStatus({
      status: 'connecting',
    }, 0);
    const datacenterDescription = document.createElement('div');
    datacenterDescription.classList.add('description');
    datacenterDescription.appendChild(datacenterName);
    datacenterDescription.appendChild(datacenterStatus);

    const datacenterExpand = document.createElement('img');
    datacenterExpand.classList.add('expand');
    datacenterExpand.src = 'assets/icons/chevrondown.svg';

    const datacenterRow = document.createElement('div');
    datacenterRow.classList.add('datacenter');
    datacenterRow.style.setProperty('--items', '3');
    datacenterRow.dataset.id = String(i);
    datacenterRow.addEventListener('click', () => {
      if (typeof currentActiveRow != 'undefined' && currentActiveRow !== datacenterRow) {
        currentActiveRow.classList.remove('expanded');
      }

      if (!isLoading) {
        const state = datacenterRow.classList.toggle('expanded');
        currentActiveRow = state ? datacenterRow : undefined;
      }
    });
    datacenterRow.appendChild(datacenterIconContainer);
    datacenterRow.appendChild(datacenterDescription);
    datacenterRow.appendChild(datacenterExpand);

    const { expandableContainer, visibleItems } = generateExpandableContainer({
      datacenterId: i,
      isFakeExpandable: true
    });
    datacenterRow.style.setProperty('--items', String(visibleItems));
    datacenterRow.appendChild(expandableContainer);

    datacentersFragment.appendChild(datacenterRow);

    availableSlots.push({
      dc_id: i,
      row: datacenterRow,
      slots: {
        status: datacenterStatus,
        expandableContainer,
        iconContainer: datacenterIconContainer,
      }
    });
  }

  datacenters.appendChild(datacentersFragment);
}

function generateExpandableContainer({
  datacenter,
  datacenterId,
  isFakeExpandable = false
}) {
  const ipContainerTitle = document.createElement('div');
  ipContainerTitle.classList.add('title');
  ipContainerTitle.textContent = getStringRef('DCSTATUS_SERVER_ADDRESS');
  const ipContainerContent = document.createElement('div');
  ipContainerContent.classList.add('text');
  ipContainerContent.textContent = config.DATACENTER_IPS[datacenterId - 1];
  const ipContainer = document.createElement('div');
  ipContainer.classList.add('indicator');
  ipContainer.appendChild(ipContainerTitle);
  ipContainer.appendChild(composeSeparatorFromIcon('assets/icons/server.svg'));
  ipContainer.appendChild(ipContainerContent);

  const lastLagContainerTitle = document.createElement('div');
  lastLagContainerTitle.classList.add('title');
  lastLagContainerTitle.textContent = getStringRef('DCSTATUS_SERVER_LAST_LAG');
  const lastLagContainerContent = document.createElement('div');
  lastLagContainerContent.classList.add('text');
  lastLagContainerContent.textContent = formatDate(isFakeExpandable ? 0 : datacenter.last_lag);
  const lastLagContainer = document.createElement('div');
  lastLagContainer.classList.add('indicator');
  lastLagContainer.appendChild(lastLagContainerTitle);
  lastLagContainer.appendChild(composeSeparatorFromIcon('assets/icons/fan.svg'));
  lastLagContainer.appendChild(lastLagContainerContent);

  const lastDownContainerTitle = document.createElement('div');
  lastDownContainerTitle.classList.add('title');
  lastDownContainerTitle.textContent = getStringRef('DCSTATUS_SERVER_LAST_DOWNTIME');
  const lastDownContainerContent = document.createElement('div');
  lastDownContainerContent.classList.add('text');
  lastDownContainerContent.textContent = formatDate(isFakeExpandable ? 0 : datacenter.last_down);
  const lastDownContainer = document.createElement('div');
  lastDownContainer.classList.add('indicator');
  lastDownContainer.appendChild(lastDownContainerTitle);
  lastDownContainer.appendChild(composeSeparatorFromIcon('assets/icons/explosion.svg'));
  lastDownContainer.appendChild(lastDownContainerContent);

  const expandableContainer = document.createElement('div');
  expandableContainer.classList.add('expandable');
  expandableContainer.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
  });
  expandableContainer.appendChild(ipContainer);

  let visibleItems = 1;

  if (isFakeExpandable || datacenter.last_lag > 0) {
    expandableContainer.appendChild(lastLagContainer);
    visibleItems++;
  }

  if (isFakeExpandable || datacenter.last_down > 0) {
    expandableContainer.appendChild(lastDownContainer);
    visibleItems++;
  }

  return { expandableContainer, visibleItems };
}

function composeSeparatorFromIcon(icon) {
  const iconElement = document.createElement('img');
  iconElement.src = icon;
  const separator = document.createElement('div');
  separator.classList.add('separator');
  separator.appendChild(iconElement);
  return separator;
}

function generateExportContainer() {
  const title = document.createElement('div');
  title.classList.add('title');
  title.textContent = getStringRef('DCSTATUS_EXPORT');

  const selectValue = document.createElement('span');
  selectValue.classList.add('value');
  selectValue.textContent = getStringRef('DCSTATUS_EXPORT_BUTTON');
  const selectIcon = document.createElement('img');
  selectIcon.classList.add('icon');
  selectIcon.src = '/assets/icons/arrowright.svg';
  const select = document.createElement('div');
  select.classList.add('select', 'mini', 'nomargin');
  select.appendChild(selectValue);
  select.appendChild(selectIcon);
  const description = document.createElement('div');
  description.classList.add('description');
  description.appendChild(select);

  const descriptor = document.createElement('div');
  descriptor.classList.add('descriptor');
  descriptor.appendChild(title);
  descriptor.appendChild(description);

  const content = document.createElement('div');
  content.classList.add('content');
  content.appendChild(descriptor);
  const card = document.createElement('div');
  card.classList.add('card', 'export');
  card.appendChild(content);

  select.addEventListener('click', () => {
    generateExportImage();
  });

  return card;
}

function initProgressLoading() {
  if (!cardDescription.classList.contains('definite')) {
    cardDescription.addEventListener('animationiteration', () => {
      cardDescription.classList.add('definite');
    }, { once: true });
  }

  let currentLeftSeconds = 6;

  const updateState = () => {
    currentLeftSeconds--;

    if (currentLeftSeconds > 0) {
      const percent = (100 * currentLeftSeconds) / 5;
      cardDescription.style.setProperty('--percent', String(percent));
      secondsIndicator.textContent = currentLeftSeconds.toString();
    } else {
      clearInterval(currentInterval);
      executeForceReload();
    }
  };

  if (typeof currentInterval != 'undefined') {
    clearInterval(currentInterval);
  }

  currentInterval = setInterval(updateState, 1000);
  secondsIndicator.textContent = '5';
}

function executeForceReload(forceReloadBackend = false) {
  cardDescription.classList.remove('definite');
  cardDescription.style.setProperty('--percent', '100');

  if (typeof currentTimeout != 'undefined') {
    clearTimeout(currentTimeout);
  }

  currentTimeout = setTimeout(() => {
    clearTimeout(currentTimeout);
    initLoading(forceReloadBackend);
  }, 300);
}

function initLoading(forceReloadBackend = false) {
  mtProtoHelper.initialize().then(() => {
    for(let i = 1; i <= config.DATACENTER_IPS.length; i++) {
      mtProtoHelper.registerDatacenterPing(String(i), (state) => {
        for (const [j, slot] of availableSlots.entries()) {
          if (slot.dc_id === i) {
            if (slot.slots.status) {
              const newStatus = composeStatus(state, slot.smallStatusState);
              slot.slots.status.replaceWith(newStatus);
              availableSlots[j].slots.status = newStatus;
            }

            if (slot.slots.iconContainer) {
              slot.slots.iconContainer.classList.toggle('is-loading', state.status !== 'pong');
            }
          }
        }
      });
    }
  });

  if (forceReloadBackend || typeof lastBackendLoadTime == 'undefined' || (Date.now() - lastBackendLoadTime) > 30000) {
    isLoading = true;
    lastBackendLoadTime = Date.now();
    requestsManager.initRequest('DCStatus/dc_status.json').then((response) => {
      const parsedContent = JSON.parse(response);

      if (typeof parsedContent.status != 'undefined') {
        isLoading = false;

        // handle slots with callback
        for(const slot of availableSlots) {
          if (!slot.dc_id && slot.callback) {
            slot.callback(parsedContent.status);
          }
        }

        for(const datacenter of parsedContent.status) {
          for(const [i, slot] of availableSlots.entries()) {
            if (slot.dc_id === datacenter.dc_id) {
              if (slot.slots.expandableContainer) {
                const { expandableContainer, visibleItems } = generateExpandableContainer({
                  datacenter,
                  datacenterId: datacenter.dc_id
                });
                slot.slots.expandableContainer.replaceWith(expandableContainer);
                availableSlots[i].slots.expandableContainer = expandableContainer;

                if (slot.row) {
                  slot.row.style.setProperty('--items', String(visibleItems));
                }
              }
            }
          }

          initProgressLoading();
        }
      }
    });
  } else {
    initProgressLoading();
  }
}

function composeStatus(status, smallState = 0) {
  const datacenterStatus = document.createElement('div');
  datacenterStatus.classList.add('status');
  datacenterStatus.classList.toggle('loading', status.status !== 'pong' && status.status !== 'offline');
  datacenterStatus.classList.toggle('offline', status.status === 'offline');
  datacenterStatus.classList.toggle('online', status.status === 'pong');

  switch (status.status) {
    case 'creating_keys':
      datacenterStatus.textContent = getStringRef('DCSTATUS_SERVER_STATUS_CREATINGKEYS');
      break;
    case 'exchanging_encryption_keys':
      datacenterStatus.textContent = getStringRef('DCSTATUS_SERVER_STATUS_EXCHANGINGKEYS');
      break;
    case 'connecting':
      datacenterStatus.textContent = getStringRef('DCSTATUS_SERVER_STATUS_CONNECTING');
      break;
    case 'pong':
      datacenterStatus.textContent = getStringRef('DCSTATUS_SERVER_STATUS_ONLINE');

      if (smallState === 1) {
        datacenterStatus.textContent += ' (' + status.ping + 'ms)';
      } else if (smallState === 2) {
        datacenterStatus.textContent = status.ping + 'ms';
      } else {
        datacenterStatus.textContent += ', Ping: ' + status.ping + 'ms';
      }

      break;
    case 'offline':
      datacenterStatus.textContent = 'Offline';
      break;
  }

  return datacenterStatus;
}

function generateIdentifyDcContainer() {
  const title = document.createElement('div');
  title.classList.add('title');
  title.textContent = getStringRef('DCSTATUS_IDENTIFY_TITLE');

  const selectValue = document.createElement('span');
  selectValue.classList.add('value');
  selectValue.textContent = getStringRef('DCSTATUS_IDENTIFY_SELECT');
  const selectIcon = document.createElement('img');
  selectIcon.classList.add('icon');
  selectIcon.src = '/assets/icons/arrowright.svg';
  const select = document.createElement('div');
  select.classList.add('select', 'mini', 'nomargin');
  select.appendChild(selectValue);
  select.appendChild(selectIcon);
  const description = document.createElement('div');
  description.classList.add('description');
  description.appendChild(select);

  const descriptor = document.createElement('div');
  descriptor.classList.add('descriptor');
  descriptor.appendChild(title);
  descriptor.appendChild(description);

  const suggestions = document.createElement('div');
  suggestions.classList.add('suggestions');
  appendSuggestions(suggestions);

  const identifyDc = document.createElement('div');
  identifyDc.classList.add('identifydc');

  const content = document.createElement('div');
  content.classList.add('content');
  content.appendChild(descriptor);
  content.appendChild(suggestions);
  content.appendChild(identifyDc);
  const card = document.createElement('div');
  card.classList.add('card', 'identify');
  card.appendChild(content);

  identifyCardSelector = select;
  identifyCardContent = content;
  identifyCardContainer = identifyDc;
  initIdentifySelector();

  return card;
}

function appendSuggestions(suggestions) {
  const prefixesSuggestions = getPrefixesSuggestions();
  if (prefixesSuggestions.length) {
    const suggestionsTitle = document.createElement('div');
    suggestionsTitle.classList.add('suggestions-title');
    suggestionsTitle.textContent = getStringRef('DCSTATUS_IDENTIFY_RAPID');
    suggestions.appendChild(suggestionsTitle);

    for (const result of prefixesSuggestions) {
      const suggestionPrefix = document.createElement('span');
      suggestionPrefix.textContent = '+' + result[0];
      const suggestionContainer = document.createElement('div');
      suggestionContainer.classList.add('select', 'mini', 'nomargin');
      suggestionContainer.addEventListener('click', () => {
        suggestions.classList.add('disabled');
        suggestionContainer.classList.add('selected');
        updateUiWithPrefix(result[0], suggestionContainer);

        identifyCardContainer.addEventListener('animationend', () => {
          suggestions.classList.remove('disabled');
          suggestions.classList.add('hidden');
          suggestionContainer.classList.remove('selected');
        }, { once: true });
      });
      suggestionContainer.textContent = result[1];
      suggestionContainer.appendChild(suggestionPrefix);
      suggestions.appendChild(suggestionContainer);
    }
  } else {
    suggestions.remove();
  }
}

function getPrefixesSuggestions() {
  const findCorrectRes = (prefix) => config.DC_DESC.some((x) => x[0] === prefix) && config.DC_DESC.filter((x) => x[0] === prefix)[0];
  let mainLanguageSuggestion;

  if (typeof window.navigator.languages != 'undefined') {
    firstLanguageFor:
    for (let language of window.navigator.languages) {
      language = language.toLowerCase();

      for (const desc of config.DC_DESC) {
        if (desc[2].toLowerCase() === language) {
          mainLanguageSuggestion = desc;
          break firstLanguageFor;
        }
      }
    }
  }

  return [
    mainLanguageSuggestion,
    findCorrectRes(1),
    findCorrectRes(30),
    findCorrectRes(33),
    findCorrectRes(974),
    findCorrectRes(1876)
  ].filter(Boolean);
}

function initIdentifySelector() {
  let newPrefixSelector = [];

  for (const dc of config.DC_DESC) {
    const isValidSugg = config.DC_ASSOC.some((x) => x.includes(dc[0]));
    if (isValidSugg) {
      newPrefixSelector.push({
        id: dc[0],
        title: dc[1],
        description: '+' + dc[0] + ' ' + getEmojiByIso2(dc[2])
      });
    }
  }

  parseCustomSelectMenu({
    element: identifyCardSelector,
    availableOptions: newPrefixSelector,
    replyWithoutWaiting: true,
    useCallbackWhenForceClose: false,
    callback: (prefix) => {
      updateUiWithPrefix(prefix);
    },
    onOpenCallback: () => {
      closePrefixIdentifyContainer();
    },
    isBig: true
  });
}

function updateUiWithPrefix(prefix, selectedElement = identifyCardSelector) {
  let found = false;
  let datacenterDataFormat;
  let datacenters = [];

  for (const datacenter of config.DC_DESC) {
    if (datacenter[0] === prefix) {
      found = true;
      datacenterDataFormat = datacenter;

      for (const [id, prefixes] of config.DC_ASSOC.entries()) {
        if (prefixes.includes(datacenter[0])) {
          datacenters.push(id + 1);
        }
      }
      break;
    }
  }

  if (found && typeof datacenterDataFormat != 'undefined') {
    clearUnavailableSlots();

    identifyCardContainer.textContent = '';
    const container = identifyCardContainer;

    const prefixContainer = document.createElement('div');
    prefixContainer.classList.add('prefix');
    prefixContainer.textContent = '+' + prefix;
    const paramContainer = document.createElement('div');
    paramContainer.classList.add('param-container');
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    placeholder.textContent = datacenterDataFormat[1].toUpperCase();
    const numberContainer = document.createElement('div');
    numberContainer.classList.add('number-container');
    numberContainer.appendChild(placeholder);
    numberContainer.appendChild(prefixContainer);
    numberContainer.appendChild(paramContainer);
    container.appendChild(numberContainer);

    const datacentersContainer = document.createElement('div');
    datacentersContainer.classList.add('dc-recap');
    container.appendChild(datacentersContainer);

    for (const datacenter of datacenters) {
      const datacenterBackground = document.createElement('div');
      datacenterBackground.classList.add('background');
      const datacenterIcon = document.createElement('img');
      datacenterIcon.src = 'assets/icons/datacenters/dc' + datacenter + '.svg';
      const datacenterIconContainer = document.createElement('div');
      datacenterIconContainer.classList.add('icon');
      datacenterIconContainer.appendChild(datacenterBackground);
      datacenterIconContainer.appendChild(datacenterIcon);

      const datacenterName = document.createElement('div');
      datacenterName.classList.add('name');
      datacenterName.textContent = 'DC' + datacenter;
      const datacenterStatus = document.createElement('div');
      const datacenterStatusMini = document.createElement('div');
      const datacenterDescription = document.createElement('div');
      datacenterDescription.classList.add('description');
      datacenterDescription.appendChild(datacenterName);
      datacenterDescription.appendChild(datacenterStatus);
      datacenterDescription.appendChild(datacenterStatusMini);

      const datacenterSum = document.createElement('div');
      datacenterSum.classList.add('datacenter');
      datacenterSum.dataset.id = datacenter;
      datacenterSum.appendChild(datacenterIconContainer);
      datacenterSum.appendChild(datacenterDescription);

      datacentersContainer.appendChild(datacenterSum);

      availableSlots.push({
        dc_id: datacenter,
        smallStatusState: 1,
        slots: {
          status: datacenterStatus,
        }
      });

      availableSlots.push({
        dc_id: datacenter,
        smallStatusState: 2,
        slots: {
          status: datacenterStatusMini,
        }
      });
    }

    let spoilerId = 0;
    for (const value of ' ' + datacenterDataFormat[3]) {
      if (value === ' ') {
        const spacer = document.createElement('div');
        spacer.classList.add('spacer');
        paramContainer.appendChild(spacer);
      } else {
        spoilerId++;

        const blurred = document.createElement('div');
        blurred.classList.add('spoiler');
        blurred.style.setProperty('--id', String(spoilerId));
        paramContainer.appendChild(blurred);

        if (spoilerId < 10) {
          blurred.textContent = String(spoilerId);
        } else {
          blurred.textContent = '0';
        }
      }
    }

    const selectRect = selectedElement.getBoundingClientRect();
    const containerRect = identifyCardContent.getBoundingClientRect();

    container.style.setProperty('--start-right', (selectRect.left - containerRect.left) + 'px');
    container.style.setProperty('--start-width', selectRect.width + 'px');
    container.style.setProperty('--start-height', selectRect.height + 'px');
    container.classList.add('animate');

    container.addEventListener('animationend', () => {
      container.classList.add('visible');
      container.classList.remove('animate');
      container.style.removeProperty('--start-right');
      container.style.removeProperty('--start-width');
      container.style.removeProperty('--start-height');
    }, { once: true });

    executeForceReload();
  }
}

function closePrefixIdentifyContainer() {
  if (identifyCardContainer.classList.contains('visible')) {
    clearUnavailableSlots();

    const selectRect = identifyCardSelector.getBoundingClientRect();
    const containerRect = identifyCardContent.getBoundingClientRect();
    const container = identifyCardContainer;

    container.style.setProperty('--start-right', (selectRect.left - containerRect.left) + 'px');
    container.style.setProperty('--start-width', selectRect.width + 'px');
    container.style.setProperty('--start-height', selectRect.height + 'px');
    container.classList.add('closing');
    container.classList.remove('visible');

    container.addEventListener('animationend', () => {
      container.classList.remove('closing');
      container.style.removeProperty('--start-right');
      container.style.removeProperty('--start-width');
      container.style.removeProperty('--start-height');

      container.textContent = '';
    }, { once: true });
  }
}

function clearUnavailableSlots() {
  for (const [id, slot] of availableSlots.entries()) {
    let availableInDom = true;

    if (!slot.dc_id && slot.callback) {
      availableInDom = false;
    } else if (slot.slots.status && !document.body.contains(slot.slots.status)) {
      availableInDom = false;
    } else if (slot.slots.expandableContainer && !document.body.contains(slot.slots.expandableContainer)) {
      availableInDom = false;
    }

    if (!availableInDom) {
      availableSlots[id] = undefined;
    }
  }

  availableSlots = availableSlots.filter((x) => typeof x != 'undefined');
  // workaround
}

function generateExportImage() {
  alert(getStringRef('DCSTATUS_EXPORT_ALERT'));

  availableSlots.push({
    callback: (data) => {
      clearUnavailableSlots();

      let finalFile = '/assets/images/dcexpbase.png';
      if (data.some((x) => x.dc_status === 0)) {
        finalFile = '/assets/images/dcexpbase_downtime.png';
      } else if (data.some((x) => x.dc_status === 2)) {
        finalFile = '/assets/images/dcexpbase_slow.png';
      }

      const bgImage = new Image();
      bgImage.src = finalFile;
      bgImage.addEventListener('load', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;

        const context = canvas.getContext('2d');
        context.drawImage(bgImage, 0, 0);

        for (const datacenter of data) {
          drawDcStateOnCanvas(context, datacenter);
        }

        const mostRecentDowntime = data.sort((a, b) => b.last_down - a.last_down)[0].last_down;
        const mostRecentLagtime = data.sort((a, b) => b.last_lag - a.last_lag)[0].last_lag;

        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillStyle = "rgb(255, 255, 255)";

        if (mostRecentDowntime && mostRecentDowntime > 0) {
          context.font = '60px Rubik';
          context.fillText(formatDate(mostRecentDowntime, 'dd/mm'), 1082, 901.2);
          context.font = '40px Rubik';
          context.fillText(formatDate(mostRecentDowntime, 'HH:ii'), 1082, 965.2);
        } else {
          context.fillText("Unknown", 1082, 901.2);
        }

        if (mostRecentLagtime && mostRecentLagtime > 0) {
          context.font = '60px Rubik';
          context.fillText(formatDate(mostRecentLagtime, 'dd/mm'), 1508.5, 901.2);
          context.font = '40px Rubik';
          context.fillText(formatDate(mostRecentLagtime, 'HH:ii'), 1508.5, 965.2);
        } else {
          context.fillText("Unknown", 1508.5, 901.2);
        }

        const fakeLink = document.createElement('a');
        fakeLink.setAttribute('download', 'export.png');
        fakeLink.setAttribute('href', canvas.toDataURL());
        document.body.appendChild(fakeLink);
        fakeLink.click();
        fakeLink.remove();
      });
      bgImage.addEventListener('error', () => {
        alert(getStringRef('DCSTATUS_EXPORT_ERROR'));
      });
    }
  });

  executeForceReload(true);
}

function drawDcStateOnCanvas(context, datacenter) {
  const drawState = CANVAS_DRAWDCSTATE[datacenter.dc_id - 1];
  if (!drawState) {
    return;
  }

  context.beginPath();

  drawPathOnContext(
    context,
    drawState.x + CANVAS_CONTAINERWIDTH / 2 - CANVAS_BADGEWIDTH / 2,
    CANVAS_BADGEY,
    CANVAS_BADGEWIDTH,// width
    CANVAS_BADGEHEIGHT, // height
    30, // borderRadius
  );

  let statusText, accentColor;
  switch (datacenter.dc_status) {
    case 0:
      accentColor = [194, 98, 102];
      statusText = 'OFFLINE';
      break;
    case 1:
      accentColor = [105, 184, 114];
      statusText = 'ONLINE';
      break;
    case 2:
      accentColor = [224, 189, 37];
      statusText = 'SLOW';
      break;
    default:
      return;
  }

  context.fillStyle = "rgba(" + accentColor.join(', ') + ", 0.2)";
  context.fill();

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = ' bold 30px Rubik';
  context.fillStyle = "rgb(" + accentColor.join(', ') + ")";
  context.fillText(
    statusText,
    drawState.x + CANVAS_CONTAINERWIDTH / 2,
    CANVAS_BADGEY + CANVAS_BADGEHEIGHT / 2,
  );

  if (datacenter.dc_status === 1) {
    context.textAlign = 'right';
    context.textBaseline = 'middle';
    context.font = '20px Rubik';
    context.fillStyle = "rgb(255, 255, 255)";
    context.fillText(
      datacenter.ping + 'ms',
      drawState.x + CANVAS_CONTAINERWIDTH - 60,
      CANVAS_BADGEY + CANVAS_BADGEHEIGHT,
    );
  }
}

function drawPathOnContext(context, x, y, width, height, borderRadius) {
  context.moveTo(x + borderRadius, y);
  context.lineTo(x + width - borderRadius, y);
  context.arc(x + width - borderRadius, y + borderRadius, borderRadius, -Math.PI / 2, 0);
  context.lineTo(x + width, y + height - borderRadius);
  context.arc(x + width - borderRadius, y + height - borderRadius, borderRadius, 0, Math.PI / 2);
  context.lineTo(x + borderRadius, y + height);
  context.arc(x + borderRadius, y + height - borderRadius, borderRadius, Math.PI / 2, Math.PI);
  context.lineTo(x, y + borderRadius);
  context.arc(x + borderRadius, y + borderRadius, borderRadius, Math.PI, -Math.PI / 2);
  context.closePath();
}

export {
  id,
  init,
};