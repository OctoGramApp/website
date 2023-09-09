class DCStatus {
  id = 'dcStatus';

  #DATACENTER_NAMES = [
    'DC1 - MIA, Miami FL, USA',
    'DC2 - AMS, Amsterdam, NL',
    'DC3 - MIA, Miami FL, USA',
    'DC4 - AMS, Amsterdam, NL',
    'DC5 - SIN, Singapore, SG'
  ];
  
  #DATACENTER_IPS = [
    '149.154.175.50',
    '149.154.167.50',
    '149.154.175.100',
    '149.154.167.91',
    '91.108.56.100'
  ];

  #DATACENTER_COUNT = 5;
  #currentTimeout;
  #currentInterval;
  #isLoading = false;
  #availableSlots = [];

  #secondsIndicator;
  #cardDescription;

  #identifyCardSelector;
  #identifyCardContent;
  #identifyCardContainer;

  init() {
    utils.clearPage(this.id, () => this.#destroy());
    window.scrollTo(0, 0);
    document.title = 'OctoGram - ' + translations.getStringRef('DCSTATUS_TITLE_PAGE');
    history.pushState(null, document.title, '/dcstatus');
    
    this.#availableSlots = [];

    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page');
    pageContainer.appendChild(header.createElement({
      onBackCallback: () => homePage.init()
    }));
    pageContainer.appendChild(this.#generatePointer());
    pageContainer.appendChild(this.#generateIdentifyDcContainer());
    pageContainer.appendChild(this.#generateServerContainer());
    pageContainer.appendChild(footer.createElement());

    document.body.appendChild(pageContainer);
    
    this.#initLoading();
  }

  #destroy() {
    if (typeof this.#currentTimeout != 'undefined') {
      clearTimeout(this.#currentTimeout);
    }

    if (typeof this.#currentInterval != 'undefined') {
      clearInterval(this.#currentInterval);
    }
  }

  #generatePointer() {
    const stickerImage = document.createElement('img');
    stickerImage.src = 'assets/animations/dcstatusAnimation.gif';
    const stickerContainer = document.createElement('div');
    stickerContainer.classList.add('sticker');
    stickerContainer.appendChild(stickerImage);
    const messageTitle = document.createElement('div');
    messageTitle.classList.add('title');
    messageTitle.textContent = translations.getStringRef('DCSTATUS_TITLE');
    const messageButton = document.createElement('div');
    messageButton.classList.add('button', 'accent');
    messageButton.addEventListener('click', () => this.#executeForceReload());
    messageButton.textContent = translations.getStringRef('DCSTATUS_BUTTON');

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

  #generateServerContainer() {
    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = translations.getStringRef('DCSTATUS_SERVER_TITLE');

    const descriptionPendingSeconds = document.createElement('span');
    descriptionPendingSeconds.classList.add('seconds');
    descriptionPendingSeconds.textContent = '29';
    const descriptionPending = document.createElement('div');
    descriptionPending.classList.add('pending');
    descriptionPending.textContent = translations.getStringRef('DCSTATUS_SERVER_DESCRIPTION') + ' ';
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
    this.#appendDatacenters(datacenters);

    const content = document.createElement('div');
    content.classList.add('content');
    content.appendChild(descriptor);
    content.appendChild(datacenters);
    const card = document.createElement('div');
    card.classList.add('card', 'server');
    card.appendChild(content);

    this.#secondsIndicator = descriptionPendingSeconds;
    this.#cardDescription = description;

    return card;
  }

  #appendDatacenters(datacenters) {
    let currentActiveRow;

    const datacentersFragment = document.createDocumentFragment();

    for(let i = 1; i <= this.#DATACENTER_COUNT; i++) {
      const datacenterBackground = document.createElement('div');
      datacenterBackground.classList.add('background');
      const datacenterIcon = document.createElement('img');
      datacenterIcon.src = 'assets/icons/datacenters/dc' + String(i) + '.svg';
      const datacenterIconContainer = document.createElement('div');
      datacenterIconContainer.classList.add('icon');
      datacenterIconContainer.appendChild(datacenterBackground);
      datacenterIconContainer.appendChild(datacenterIcon);

      const datacenterName = document.createElement('div');
      datacenterName.classList.add('name');
      datacenterName.textContent = this.#DATACENTER_NAMES[i - 1];
      const datacenterStatus = document.createElement('span');
      datacenterStatus.textContent = 'Loading';
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
      datacenterRow.dataset.id = i;
      datacenterRow.addEventListener('click', () => {
        if (typeof currentActiveRow != 'undefined' && currentActiveRow != datacenterRow) {
          currentActiveRow.classList.remove('expanded');
        }

        if (!this.#isLoading) {
          const state = datacenterRow.classList.toggle('expanded');
          currentActiveRow = state ? datacenterRow : undefined;
        }
      });
      datacenterRow.appendChild(datacenterIconContainer);
      datacenterRow.appendChild(datacenterDescription);
      datacenterRow.appendChild(datacenterExpand);

      const { expandableContainer, visibleItems } = this.#generateExpandableContainer({
        datacenterId: i,
        isFakeExpandable: true
      });
      datacenterRow.style.setProperty('--items', visibleItems);
      datacenterRow.appendChild(expandableContainer);

      datacentersFragment.appendChild(datacenterRow);

      this.#availableSlots.push({
        dc_id: i,
        row: datacenterRow,
        slots: {
          status: datacenterStatus,
          expandableContainer,
        }
      });
    }
    
    datacenters.appendChild(datacentersFragment);
  }

  #generateExpandableContainer({
    datacenter,
    datacenterId,
    isFakeExpandable = false
  }) {
    const ipContainerTitle = document.createElement('div');
    ipContainerTitle.classList.add('title');
    ipContainerTitle.textContent = translations.getStringRef('DCSTATUS_SERVER_ADDRESS');
    const ipContainerContent = document.createElement('div');
    ipContainerContent.classList.add('text');
    ipContainerContent.textContent = this.#DATACENTER_IPS[datacenterId - 1];
    const ipContainer = document.createElement('div');
    ipContainer.classList.add('indicator');
    ipContainer.appendChild(ipContainerTitle);
    ipContainer.appendChild(this.#composeSeparatorFromIcon('assets/icons/server.svg'));
    ipContainer.appendChild(ipContainerContent);

    const lastLagContainerTitle = document.createElement('div');
    lastLagContainerTitle.classList.add('title');
    lastLagContainerTitle.textContent = translations.getStringRef('DCSTATUS_SERVER_LAST_LAG');
    const lastLagContainerContent = document.createElement('div');
    lastLagContainerContent.classList.add('text');
    lastLagContainerContent.textContent = utils.formatDate(isFakeExpandable ? 0 : datacenter.last_lag);
    const lastLagContainer = document.createElement('div');
    lastLagContainer.classList.add('indicator');
    lastLagContainer.appendChild(lastLagContainerTitle);
    lastLagContainer.appendChild(this.#composeSeparatorFromIcon('assets/icons/fan.svg'));
    lastLagContainer.appendChild(lastLagContainerContent);

    const lastDownContainerTitle = document.createElement('div');
    lastDownContainerTitle.classList.add('title');
    lastDownContainerTitle.textContent = translations.getStringRef('DCSTATUS_SERVER_LAST_DOWNTIME');
    const lastDownContainerContent = document.createElement('div');
    lastDownContainerContent.classList.add('text');
    lastDownContainerContent.textContent = utils.formatDate(isFakeExpandable ? 0 : datacenter.last_down);
    const lastDownContainer = document.createElement('div');
    lastDownContainer.classList.add('indicator');
    lastDownContainer.appendChild(lastDownContainerTitle);
    lastDownContainer.appendChild(this.#composeSeparatorFromIcon('assets/icons/explosion.svg'));
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

  #composeSeparatorFromIcon(icon) {
    const iconElement = document.createElement('img');
    iconElement.src = icon;
    const separator = document.createElement('div');
    separator.classList.add('separator');
    separator.appendChild(iconElement);
    return separator;
  }

  #initProgressLoading() {
    if (!this.#cardDescription.classList.contains('definite')) {
      this.#cardDescription.addEventListener('animationiteration', () => {
        this.#cardDescription.classList.add('definite');
      }, { once: true });
    }

    let currentLeftSeconds = 31;

    const updateState = () => {
      currentLeftSeconds--;

      if (currentLeftSeconds > 0) {
        const percent = (100 * currentLeftSeconds) / 30;
        this.#cardDescription.style.setProperty('--percent', percent);
        this.#secondsIndicator.textContent = currentLeftSeconds.toString();
      } else {
        clearInterval(this.#currentInterval);
        this.#executeForceReload();
      }
    };

    if (typeof this.#currentInterval != 'undefined') {
      clearInterval(this.#currentInterval);
    }

    this.#currentInterval = setInterval(updateState, 1000);
    this.#secondsIndicator.textContent = '30';
  }

  #executeForceReload() {
    this.#cardDescription.classList.remove('definite');
    this.#cardDescription.style.setProperty('--percent', 100);

    if (typeof this.#currentTimeout != 'undefined') {
      clearTimeout(this.#currentTimeout);
    }

    this.#currentTimeout = setTimeout(() => {
      clearTimeout(this.#currentTimeout);
      this.#initLoading();
    }, 300);
  }
  
  #initLoading() {
    this.#isLoading = true;

    const XML = new XMLHttpRequest();
    XML.open('GET', 'https://api.github.com/repos/OctoGramApp/assets/contents/DCStatus/dc_status.json?cache='+Math.random().toString(), true);
    XML.send();
    XML.addEventListener('readystatechange', (e) => {
      if (e.target.readyState == 4 && e.target.status == 200) {
        const response = JSON.parse(e.target.responseText);

        if (response['content'].length > 0) {
          const parsedContent = JSON.parse(atob(response['content']));

          if (typeof parsedContent.status != 'undefined') {
            this.#isLoading = false;
  
            for(const datacenter of parsedContent.status) {
              for(const [i, slot] of this.#availableSlots.entries()) {
                if (slot.dc_id == datacenter.dc_id) {
                  if (slot.slots.status) {
                    const newStatus = this.#composeStatus(datacenter, slot.smallStatusState);
                    slot.slots.status.replaceWith(newStatus);
                    this.#availableSlots[i].slots.status = newStatus;
                  }
  
                  if (slot.slots.expandableContainer) {
                    const { expandableContainer, visibleItems } = this.#generateExpandableContainer({
                      datacenter,
                      datacenterId: datacenter.dc_id
                    });
                    slot.slots.expandableContainer.replaceWith(expandableContainer);
                    this.#availableSlots[i].slots.expandableContainer = expandableContainer;
  
                    if (slot.row) {
                      slot.row.style.setProperty('--items', visibleItems);
                    }
                  }
                }
              }
            }
  
            this.#initProgressLoading();
          }
        }
      }
    });
  }

  #composeStatus(datacenter, smallState = 0) {
    const datacenterStatus = document.createElement('div');
    datacenterStatus.classList.add('status');
  
    switch(datacenter.dc_status) {
      case 0:
        datacenterStatus.classList.add('offline');
        datacenterStatus.textContent = translations.getStringRef('DCSTATUS_SERVER_STATUS_OFFLINE');
      break;
      case 1:
        datacenterStatus.classList.add('online');
        datacenterStatus.textContent = translations.getStringRef('DCSTATUS_SERVER_STATUS_ONLINE');
      break;
      case 2:
        datacenterStatus.classList.add('slow');
        datacenterStatus.textContent = translations.getStringRef('DCSTATUS_SERVER_STATUS_SLOW');
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

  #generateIdentifyDcContainer() {
    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = translations.getStringRef('DCSTATUS_IDENTIFY_TITLE');

    const selectValue = document.createElement('span');
    selectValue.classList.add('value');
    selectValue.textContent = translations.getStringRef('DCSTATUS_IDENTIFY_SELECT');
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
    this.#appendSuggestions(suggestions);

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

    this.#identifyCardSelector = select;
    this.#identifyCardContent = content;
    this.#identifyCardContainer = identifyDc;
    this.#initIdentifySelector();

    return card;
  }

  #appendSuggestions(suggestions) {
    const prefixesSuggestions = this.#getPrefixesSuggestions();
    if (prefixesSuggestions.length) {
      const suggestionsTitle = document.createElement('div');
      suggestionsTitle.classList.add('suggestions-title');
      suggestionsTitle.textContent = translations.getStringRef('DCSTATUS_IDENTIFY_RAPID');
      suggestions.appendChild(suggestionsTitle);

      for(const result of prefixesSuggestions) {
        const suggestionPrefix = document.createElement('span');
        suggestionPrefix.textContent = '+' + result[0];
        const suggestionContainer = document.createElement('div');
        suggestionContainer.classList.add('select', 'mini', 'nomargin');
        suggestionContainer.addEventListener('click', () => {
          suggestions.classList.add('disabled');
          suggestionContainer.classList.add('selected');
          this.#updateUiWithPrefix(result[0], suggestionContainer);

          this.#identifyCardContainer.addEventListener('animationend', () => {
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

  #getPrefixesSuggestions() {
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

  #initIdentifySelector() {
    let newPrefixSelector = [];

    for(const dc of DC_DESC) {
      newPrefixSelector.push({
        id: dc[0],
        title: dc[1],
        description: '+' + dc[0] + ' ' + utils.getEmojiByIso2(dc[2])
      });
    }

    utils.parseCustomSelectMenu({
      element: this.#identifyCardSelector,
      availableOptions: newPrefixSelector,
      replyWithoutWaiting: true,
      useCallbackWhenForceClose: false,
      callback: (prefix) => {
        this.#updateUiWithPrefix(prefix);
      },
      onOpenCallback: () => {
        this.#closePrefixIdentifyContainer();
      },
      isBig: true
    });
  }

  #updateUiWithPrefix(prefix, selectedElement = this.#identifyCardSelector) {
    let found = false;
    let datacenterDataFormat;
    let datacenters = [];

    for (const datacenter of DC_DESC) {
      if (datacenter[0] == prefix) {
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
      this.#clearUnavailableSlots();

      this.#identifyCardContainer.textContent = '';
      const container = this.#identifyCardContainer;
      
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

      for(const datacenter of datacenters) {
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

        this.#availableSlots.push({
          dc_id: datacenter,
          smallStatusState: 1,
          slots: {
            status: datacenterStatus,
          }
        });

        this.#availableSlots.push({
          dc_id: datacenter,
          smallStatusState: 2,
          slots: {
            status: datacenterStatusMini,
          }
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

      const selectRect = selectedElement.getBoundingClientRect();
      const containerRect = this.#identifyCardContent.getBoundingClientRect();

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

      this.#executeForceReload();
    }
  }

  #closePrefixIdentifyContainer() {
    if (this.#identifyCardContainer.classList.contains('visible')) {
      this.#clearUnavailableSlots();

      const selectRect = this.#identifyCardSelector.getBoundingClientRect();
      const containerRect = this.#identifyCardContent.getBoundingClientRect();
      const container = this.#identifyCardContainer;

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

  #clearUnavailableSlots() {
    for(const [id, slot] of this.#availableSlots.entries()) {
      let availableInDom = true;

      if (slot.slots.status && !document.body.contains(slot.slots.status)) {
        availableInDom = false;
      } else if(slot.slots.expandableContainer && !document.body.contains(slot.slots.expandableContainer)) {
        availableInDom = false;
      }
      
      if (!availableInDom) {
        this.#availableSlots[id] = undefined;
      }
    }

    this.#availableSlots = this.#availableSlots.filter((x) => typeof x != 'undefined');
    // workaround
  }
}

const dcStatus = new DCStatus();