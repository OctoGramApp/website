const DATACENTER_NAMES = [
  'DC1 - MIA, Miami FL, USA',
  'DC2 - AMS, Amsterdam, NL',
  'DC3 - MIA, Miami FL, USA',
  'DC4 - AMS, Amsterdam, NL',
  'DC5 - SIN, Singapore, SG'
];

const DATACENTER_IPS = [
  '149.154.175.50',
  '149.154.167.50',
  '149.154.175.100',
  '149.154.167.91',
  '91.108.56.100'
];

const DATACENTER_COUNT = 5;
let currentTimeout;
let currentInterval;
let currentActiveDcId;
let isLoading = false;
let customDataSlots = [];

window.addEventListener('load', () => {
  reloadState();

  const reloadButton = document.querySelector('body > .page > .pointer .message .button');
  if (reloadButton != null) {
    reloadButton.addEventListener('click', () => {
      executeForceReload();
    });
  }

  const identifyCardContent = document.querySelector('body > .page > .card.identify .content');
  if (identifyCardContent != null) {
    const selector = identifyCardContent.querySelector('.description .select');
    const suggestions = identifyCardContent.querySelector('.suggestions');
    const container = identifyCardContent.querySelector('.identifydc');
    if (selector != null && suggestions != null && container != null) {
      const prefixesSuggestions = getPrefixesSuggestions();
      if (prefixesSuggestions.length) {
        const suggestionsTitle = document.createElement('div');
        suggestionsTitle.classList.add('suggestions-title');
        suggestionsTitle.textContent = 'Rapid suggestions';
        suggestions.appendChild(suggestionsTitle);

        for(const result of prefixesSuggestions) {
          const suggestionPrefix = document.createElement('span');
          suggestionPrefix.textContent = '+' + result[0];
          const suggestionContainer = document.createElement('div');
          suggestionContainer.classList.add('select', 'mini', 'nomargin');
          suggestionContainer.addEventListener('click', () => {
            suggestions.classList.add('disabled');
            suggestionContainer.classList.add('selected');
            updateUiWithPrefix(result[0], suggestionContainer, identifyCardContent, container);

            container.addEventListener('animationend', () => {
              suggestions.classList.remove('disabled');
              suggestions.classList.add('hidden');
              suggestionContainer.classList.remove('selected');
            }, { once: true });
          });
          suggestionContainer.textContent = result[1];
          suggestionContainer.appendChild(suggestionPrefix);
          suggestions.appendChild(suggestionContainer);
        }
      }

      let newPrefixSelector = [];

      for(const dc of DC_DESC) {
        newPrefixSelector.push({
          id: dc[0],
          title: dc[1],
          description: '+' + dc[0] + ' ' + getEmojiByIso2(dc[2])
        });
      }

      parseCustomSelectMenu({
        element: selector,
        availableOptions: newPrefixSelector,
        replyWithoutWaiting: true,
        useCallbackWhenForceClose: false,
        callback: (id) => {
          updateUiWithPrefix(id, selector, identifyCardContent, container);
        },
        onOpenCallback: () => {
          if (container.classList.contains('visible')) {
            const selectRect = selector.getBoundingClientRect();
            const containerRect = identifyCardContent.getBoundingClientRect();
  
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
        },
        isBig: true
      });
    }
  }
});

function updateUiWithPrefix(id, selector, identifyCardContent, container) {
  customDataSlots = [];

  let found = false;
  let datacenterDataFormat;
  let datacenters = [];

  for (const datacenter of DC_DESC) {
    if (datacenter[0] == id) {
      found = true;
      datacenterDataFormat = datacenter;

      for (const [id, prefixes] of DC_ASSOC.entries()) {
        if (prefixes.includes(datacenter[0])) {
          datacenters.push(id + 1);
        }
      }
      break;
    }
  }

  if (found && typeof datacenterDataFormat != 'undefined') {
    container.textContent = '';

    const prefixContainer = document.createElement('div');
    prefixContainer.classList.add('prefix');
    prefixContainer.textContent = '+' + id;
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

    for(const datacenter of datacenters) {
      const datacenterBackground = document.createElement('div');
      datacenterBackground.classList.add('background');
      const datacenterIcon = document.createElement('img');
      datacenterIcon.src = 'assets/icons/datacenters/dc'+datacenter+'.svg';
      const datacenterIconContainer = document.createElement('div');
      datacenterIconContainer.classList.add('icon');
      datacenterIconContainer.appendChild(datacenterBackground);
      datacenterIconContainer.appendChild(datacenterIcon);

      const datacenterName = document.createElement('div');
      datacenterName.classList.add('name');
      datacenterName.textContent = 'DC'+datacenter;
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

      customDataSlots.push({
        dc: datacenter,
        element: datacenterStatus,
        small: 1
      });
      customDataSlots.push({
        dc: datacenter,
        element: datacenterStatusMini,
        small: 2
      });
    }

    let spoilerId = 0;
    for(const value of ' ' + datacenterDataFormat[3]) {
      if (value == ' ') {
        const spacer = document.createElement('div');
        spacer.classList.add('spacer');
        paramContainer.appendChild(spacer);
      } else {
        spoilerId++;

        const blurred = document.createElement('div');
        blurred.classList.add('spoiler');
        blurred.style.setProperty('--id', spoilerId);
        paramContainer.appendChild(blurred);

        if (spoilerId < 10) {
          blurred.textContent = spoilerId;
        } else {
          blurred.textContent = '0';
        }
      }
    }

    const selectRect = selector.getBoundingClientRect();
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

function reloadState() {
  const bodyItem = document.querySelector('body > .page > .card.server .content .datacenters');
  if (bodyItem != null && !isLoading) {
    isLoading = true;
    const XML = new XMLHttpRequest();
    XML.open('GET', 'https://raw.githubusercontent.com/OctoGramApp/assets/main/DCStatus/dc_status.json?cache='+Math.random().toString(), true);
    XML.send();
    XML.addEventListener('readystatechange', (e) => {
      if (e.target.readyState == 4 && e.target.status == 200) {
        const response = JSON.parse(e.target.responseText);
        
        if (typeof response.status != 'undefined') {
          const fragment = document.createDocumentFragment();
          let currentActiveRow;
          
          let status = response.status;
          status.sort((a, b) => a.dc_id - b.dc_id);

          for(const datacenter of status) {
            if (datacenter.dc_id <= DATACENTER_COUNT) {
              const datacenterBackground = document.createElement('div');
              datacenterBackground.classList.add('background');
              const datacenterIcon = document.createElement('img');
              datacenterIcon.src = 'assets/icons/datacenters/dc'+datacenter.dc_id+'.svg';
              const datacenterIconContainer = document.createElement('div');
              datacenterIconContainer.classList.add('icon');
              datacenterIconContainer.appendChild(datacenterBackground);
              datacenterIconContainer.appendChild(datacenterIcon);

              const datacenterName = document.createElement('div');
              datacenterName.classList.add('name');
              datacenterName.textContent = DATACENTER_NAMES[datacenter.dc_id - 1];
              const datacenterStatus = composeStatus(datacenter);
              const datacenterDescription = document.createElement('div');
              datacenterDescription.classList.add('description');
              datacenterDescription.appendChild(datacenterName);
              datacenterDescription.appendChild(datacenterStatus);

              const datacenterExpand = document.createElement('img');
              datacenterExpand.classList.add('expand');
              datacenterExpand.src = 'assets/icons/chevrondown.svg';

              const datacenterRow = document.createElement('div');
              datacenterRow.classList.add('datacenter');
              datacenterRow.dataset.id = datacenter.dc_id;
              datacenterRow.addEventListener('click', () => {
                if (typeof currentActiveRow != 'undefined' && currentActiveRow != datacenterRow) {
                  currentActiveRow.classList.remove('expanded');
                }

                const state = datacenterRow.classList.toggle('expanded');
                currentActiveRow = state ? datacenterRow : undefined;
                currentActiveDcId = state ? datacenter.dc_id : undefined;
              });
              datacenterRow.appendChild(datacenterIconContainer);
              datacenterRow.appendChild(datacenterDescription);
              datacenterRow.appendChild(datacenterExpand);
              createExpandableContainer(datacenter, datacenterRow);

              if (typeof currentActiveDcId != 'undefined' && currentActiveDcId == datacenter.dc_id) {
                datacenterRow.classList.add('expanded');
                currentActiveRow = datacenterRow;
              }

              fragment.append(datacenterRow);

              for(const slot of customDataSlots) {
                if (slot.dc == datacenter.dc_id) {
                  slot.element.replaceWith(composeStatus(datacenter, slot.small));
                }
              }
            }
          }

          bodyItem.innerHTML = '';
          bodyItem.appendChild(fragment);
          isLoading = false;
          initReload();
        }
      } else if(e.target.readyState == 4) {
        bodyItem.innerHTML = '';
        bodyItem.appendChild(composeErrorContainer());
        isLoading = false;
        initReload();
      }
    });
  }
}

function initReload() {
  const loadingItem = document.querySelector('body > .page > .card.server .content .descriptor .description');
  const leftSeconds = document.querySelector('body > .page > .card.server .content .descriptor .description .seconds');
  if (loadingItem != null && leftSeconds != null) {
    if (!loadingItem.classList.contains('definite')) {
      loadingItem.addEventListener('animationiteration', () => {
        loadingItem.classList.add('definite');
      }, { once: true });
    }

    let currentLeftSeconds = 30;

    const updateState = () => {
      currentLeftSeconds--;

      if (currentLeftSeconds > 0) {
        const percent = (100 * currentLeftSeconds) / 30;
        loadingItem.style.setProperty('--percent', percent);
        leftSeconds.textContent = currentLeftSeconds;
      } else {
        clearInterval(currentInterval);
        executeForceReload();
      }
    };

    if (typeof currentInterval != 'undefined') {
      clearInterval(currentInterval);
    }

    currentInterval = setInterval(updateState, 1000);
    updateState();
  }
}

function executeForceReload() {
  const loadingItem = document.querySelector('body > .page > .card.server .content .descriptor .description');
  if (loadingItem != null) {
    loadingItem.classList.remove('definite');
    loadingItem.style.setProperty('--percent', 100);

    if (typeof currentTimeout != 'undefined') {
      clearTimeout(currentTimeout);
    }

    currentTimeout = setTimeout(() => {
      clearTimeout(currentTimeout);
      reloadState();
    }, 800);
  }
}

function composeErrorContainer(){
  const sticker = document.createElement('img');
  sticker.src = 'assets/animations/dcstatusFailAnimation.gif';

  const title = document.createElement('div');
  title.classList.add('title');
  title.textContent = 'Something went wrong.';
  const description = document.createElement('div');
  description.classList.add('description');
  description.textContent = 'Please retry later.';
  const message = document.createElement('div');
  message.classList.add('message');
  message.appendChild(title);
  message.appendChild(description);

  const container = document.createElement('div');
  container.classList.add('error');
  container.appendChild(sticker);
  container.appendChild(message);

  return container;
}

function createExpandableContainer(datacenter, container) {
  const ipContainerTitle = document.createElement('div');
  ipContainerTitle.classList.add('title');
  ipContainerTitle.textContent = 'IP Address';
  const ipContainerContent = document.createElement('div');
  ipContainerContent.classList.add('text');
  ipContainerContent.textContent = DATACENTER_IPS[datacenter.dc_id - 1];
  const ipContainer = document.createElement('div');
  ipContainer.classList.add('indicator');
  ipContainer.appendChild(ipContainerTitle);
  ipContainer.appendChild(composeSeparatorFromIcon('assets/icons/server.svg'));
  ipContainer.appendChild(ipContainerContent);

  const lastLagContainerTitle = document.createElement('div');
  lastLagContainerTitle.classList.add('title');
  lastLagContainerTitle.textContent = 'Last lag';
  const lastLagContainerContent = document.createElement('div');
  lastLagContainerContent.classList.add('text');
  lastLagContainerContent.textContent = formatDate(datacenter.last_lag);
  const lastLagContainer = document.createElement('div');
  lastLagContainer.classList.add('indicator');
  lastLagContainer.appendChild(lastLagContainerTitle);
  lastLagContainer.appendChild(composeSeparatorFromIcon('assets/icons/fan.svg'));
  lastLagContainer.appendChild(lastLagContainerContent);

  const lastDownContainerTitle = document.createElement('div');
  lastDownContainerTitle.classList.add('title');
  lastDownContainerTitle.textContent = 'Last downtime';
  const lastDownContainerContent = document.createElement('div');
  lastDownContainerContent.classList.add('text');
  lastDownContainerContent.textContent = formatDate(datacenter.last_down);
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

  if (datacenter.last_lag > 0) {
    expandableContainer.appendChild(lastLagContainer);
    visibleItems++;
  }

  if (datacenter.last_down > 0) {
    expandableContainer.appendChild(lastDownContainer);
    visibleItems++;
  }

  container.style.setProperty('--items', visibleItems);
  container.appendChild(expandableContainer);
}

function composeSeparatorFromIcon(icon) {
  const iconElement = document.createElement('img');
  iconElement.src = icon;
  const separator = document.createElement('div');
  separator.classList.add('separator');
  separator.appendChild(iconElement);
  return separator;
}

function composeStatus(datacenter, smallState = 0) {
  const datacenterStatus = document.createElement('div');
  datacenterStatus.classList.add('status');

  switch(datacenter.dc_status) {
    case 0:
      datacenterStatus.classList.add('offline');
      datacenterStatus.textContent = 'Offline';
    break;
    case 1:
      datacenterStatus.classList.add('online');
      datacenterStatus.textContent = 'Available';
    break;
    case 2:
      datacenterStatus.classList.add('slow');
      datacenterStatus.textContent = 'Slow';
    break;
  }

  if (smallState == 1) {
    datacenterStatus.textContent += ' ('+datacenter.ping+'ms)';
  } else if(smallState == 2) {
    if (datacenter.dc_status == 1) {
      datacenterStatus.textContent = datacenter.ping+'ms';
    }
  } else if (datacenter.dc_status != 0) {
    datacenterStatus.textContent += ', Ping: '+datacenter.ping+'ms';
  }

  return datacenterStatus;
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);

  let format = 'YY-mm-dd HH:ii:ss';
  if (canUseItalianFormat()) {
    format = 'dd/mm/YY HH:ii:ss';
  }

  let finalString = format;
  finalString = finalString.replace('dd', formatDateUnit(date.getDate()));
  finalString = finalString.replace('mm', formatDateUnit(date.getMonth()+1));
  finalString = finalString.replace('YY', formatDateUnit(date.getFullYear()));
  finalString = finalString.replace('HH', formatDateUnit(date.getHours()));
  finalString = finalString.replace('ii', formatDateUnit(date.getMinutes()));
  finalString = finalString.replace('ss', formatDateUnit(date.getSeconds()));

  return finalString;
}

function canUseItalianFormat() {
  return (
    typeof window.navigator?.language != 'undefined'
    && window.navigator.language.indexOf('it') != -1
  );
}

function formatDateUnit(unit) {
  if (unit.toString().length == 1) {
    return '0'+unit;
  } else {
    return unit;
  }
}

function getPrefixesSuggestions() {
  const findCorrectRes = (prefix) => DC_DESC.some((x) => x[0] == prefix) && DC_DESC.filter((x) => x[0] == prefix)[0];
  let mainLanguageSuggestion;

  if (typeof window.navigator.languages != 'undefined') {
    firstLanguageFor:
    for(let language of window.navigator.languages) {
      language = language.toLowerCase();
      
      for(const desc of DC_DESC) {
        if (desc[2].toLowerCase() == language) {
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
  ].filter((x) => !!x);
}