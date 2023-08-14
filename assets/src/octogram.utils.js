function fixInjectionTags(text) {
  const VALID_TAGS = ['b', '/b', 'code', '/code'];
  const TAG_REPLACEMENTS = {
    'b': '<span class="bold">',
    '/b': '</span>',
    'code': '<span class="code">',
    '/code': '</span>'
  };

  if (text.indexOf('<') != -1) {
    for(const [i, tag] of text.split('<').entries()) {
      if (i != 0) {
        const realTag = tag.split('>')[0];
        if (VALID_TAGS.includes(realTag.toLowerCase())) {
          const replacement = TAG_REPLACEMENTS[realTag.toLowerCase()];
          if (replacement){
            text = text.replaceAll('<'+realTag+'>', replacement);
          }
        } else {
          text = text.replaceAll('<'+realTag+'>', '');
        }
      }
    }
  }

  text = text.replaceAll('\n', '<br/>');
  text = text.replaceAll('\r', '');
  
  return text;
}

function parseCustomSelectMenu(element, availableOptions, callback) {
  let lastSelectedOption;
  let currentSelectedOption;

  element.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    let isClosing = false;
    let isOpening = true;

    function closeSelectMenu() {
      if (!isClosing && !isOpening) {
        isClosing = true;

        selectOverflow.classList.add('closing');
        selectOverflow.addEventListener('animationend', (e) => {
          if (e.target == selectOverflow || e.target == selectMenu) {
            selectOverflow.remove();
            
            if (typeof lastSelectedOption != 'undefined') {
              callback(lastSelectedOption);
            }
          }
        });
      }
    }

    let i = 0;
    const optionsFragment = document.createDocumentFragment();
    for(const { id, title, description } of availableOptions) {
      i++;

      const radioOption = document.createElement('div');
      radioOption.classList.add('radio');
      radioOption.classList.toggle('selected', lastSelectedOption == id);

      const optionTitle = document.createElement('div');
      optionTitle.classList.add('optiontitle');
      optionTitle.textContent = title;

      const option = document.createElement('div');
      option.classList.add('option');
      option.style.setProperty('--id', i);
      option.addEventListener('click', () => {
        if (typeof currentSelectedOption != 'undefined') {
          currentSelectedOption.classList.remove('selected');
        }

        radioOption.classList.add('selected');
        currentSelectedOption = radioOption;
        lastSelectedOption = id;
      });
      option.appendChild(radioOption);
      option.appendChild(optionTitle);

      if (lastSelectedOption == id) {
        radioOption.classList.add('selected');
        currentSelectedOption = radioOption;
      }

      if (description != null) {
        const optionDescription = document.createElement('div');
        optionDescription.classList.add('description');
        optionDescription.textContent = description;
        option.appendChild(optionDescription);
      }
      
      optionsFragment.append(option);
    }

    const selectAnimation = document.createElement('img');
    selectAnimation.classList.add('animation');
    selectAnimation.src = '/assets/animations/bornAnimation.gif';

    const selectButton = document.createElement('div');
    selectButton.classList.add('button', 'big', 'accent');
    selectButton.addEventListener('click', closeSelectMenu);
    selectButton.textContent = 'Select';

    const selectMenu = document.createElement('div');
    selectMenu.classList.add('select-menu');
    selectMenu.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
    });
    selectMenu.appendChild(selectAnimation);
    selectMenu.appendChild(optionsFragment);
    selectMenu.appendChild(selectButton);

    const selectOverflow = document.createElement('div');
    selectOverflow.classList.add('select-overflow');
    selectOverflow.addEventListener('click', closeSelectMenu);
    selectOverflow.addEventListener('animationend', () => {
      isOpening = false;
    }, { once: true });
    selectOverflow.appendChild(selectMenu);

    const page = document.querySelector('body > .page:not(.js-error)');
    if (page != null) {
      page.appendChild(selectOverflow);
      page.classList.add('has-select-overflow');
    }
  });
}

function parseApkName(name) {
  switch(name) {
    case 'OctoGram_arm32.apk':
      return 'For ARM32 devices';
    case 'OctoGram_arm64.apk':
      return 'For ARM64 devices';
    case 'OctoGram_universal.apk':
      return 'Universal';
    case 'OctoGram_x86.apk':
      return 'For x86 devices';
    case 'OctoGram_x86_64.apk':
      return 'For x86_64 devices';
    default:
      return name;
  }
}

function calculateSize(size, useBinaryUnits = true, addSpace = false){
  const binaryUnits = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  const basicUnits = ['B', 'KB', 'MB', 'GB', 'TB'];
  const units = useBinaryUnits ? binaryUnits : basicUnits;
  const divisorParam = useBinaryUnits ? 1024 : 1000;

  let divisionCounter = 0;
  let currentDivisor = size;
  while(currentDivisor >= divisorParam && divisionCounter < 4){
    divisionCounter++;
    currentDivisor /= divisorParam;
  }
  
  let finalString = '';
  finalString += currentDivisor.toFixed(1);
  finalString += addSpace ? ' ' : '';
  finalString += units[divisionCounter];
  return finalString;
}