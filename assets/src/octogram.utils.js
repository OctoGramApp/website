import {getStringRef} from "./octogram.translations.js";
import * as parallaxHelper from "./octogram.parallax.js";

let currentPageId;
let currentPageOnDestroyCallback;

function fixInjectionTags(text) {
  const VALID_TAGS = ['b', '/b', 'code', '/code', '/a'];
  const TAG_REPLACEMENTS = {
    'b': '<span class="bold">',
    '/b': '</span>',
    'code': '<span class="code">',
    '/code': '</span>'
  };

  if (text.indexOf('<') !== -1) {
    for(const [i, tag] of text.split('<').entries()) {
      if (i !== 0) {
        const realTag = tag.split('>')[0];
        const isLinkTag = realTag.startsWith('a href="https://') || realTag.startsWith("a href='https://");
        if (VALID_TAGS.includes(realTag.toLowerCase()) || isLinkTag) {
          const replacement = TAG_REPLACEMENTS[realTag.toLowerCase()];
          if (isLinkTag) {
            if (realTag.indexOf('target=') === -1) {
              text = text.replaceAll('<'+realTag+'>', '<'+realTag+' target="_blank">');
            }
          } else if (replacement){
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

function parseCustomSelectMenu({
  element,
  availableOptions,
  callback,
  onOpenCallback,
  description,
  replyWithoutWaiting = false,
  isBig = false,
  useCallbackWhenForceClose = true
}) {
  let lastSelectedOption;
  let currentSelectedOption;

  if (isBig) {
    availableOptions.sort((a, b) => a.title[0].localeCompare(b.title[0]));
  }

  element.addEventListener('click', (e) => {
    if (typeof onOpenCallback != 'undefined') {
      try {
        onOpenCallback();
      } catch(_) {}
    }

    e.preventDefault();
    e.stopImmediatePropagation();
    let isClosing = false;
    let isOpening = true;

    function closeSelectMenu(selectedAnOption) {
      if (!isClosing && !isOpening) {
        isClosing = true;
        
        const sendCallback = useCallbackWhenForceClose || selectedAnOption;

        if (typeof lastSelectedOption != 'undefined' && replyWithoutWaiting && sendCallback) {
          try {
            callback(lastSelectedOption);
          } catch(_) {}
        }

        selectOverflow.classList.add('closing');
        selectOverflow.addEventListener('animationend', (e) => {
          if (e.target === selectOverflow || e.target === selectMenu) {
            selectOverflow.remove();
            
            if (typeof lastSelectedOption != 'undefined' && !replyWithoutWaiting && sendCallback) {
              try {
                callback(lastSelectedOption);
              } catch(_) {}
            }
          }
        });
      }
    }

    let lastInitLetter = '';
    let initLettersAssoc = {};

    const optionsFragment = document.createDocumentFragment();
    for(const [i, { id, title, description }] of Object.entries(availableOptions)) {
      if (isBig && lastInitLetter !== title[0].toUpperCase() && !initLettersAssoc[title[0].toUpperCase()]) {
        lastInitLetter = title[0].toUpperCase();

        const letterSeparator = document.createElement('div');
        letterSeparator.classList.add('letter-separator');
        letterSeparator.textContent = lastInitLetter;
        optionsFragment.append(letterSeparator);

        initLettersAssoc[lastInitLetter] = letterSeparator;
      }

      const radioOption = document.createElement('div');
      radioOption.classList.add('radio');
      radioOption.classList.toggle('selected', lastSelectedOption === id);

      const optionTitle = document.createElement('div');
      optionTitle.classList.add('optiontitle');
      optionTitle.textContent = title;

      const option = document.createElement('div');
      option.classList.add('option');
      option.addEventListener('click', () => {
        if (typeof currentSelectedOption != 'undefined') {
          currentSelectedOption.classList.remove('selected');
        }

        radioOption.classList.add('selected');
        currentSelectedOption = radioOption;
        lastSelectedOption = id;
        
        if (isBig) {
          closeSelectMenu(true);
        }
      });
      option.appendChild(radioOption);
      option.appendChild(optionTitle);

      if (!isBig) {
        option.style.setProperty('--id', String(parseInt(i) + 1));
      }

      if (lastSelectedOption === id) {
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
    selectButton.addEventListener('click', () => closeSelectMenu(true));
    selectButton.textContent = 'Select';

    const hasDescription = typeof description == 'string';
    const selectMenuDescription = document.createElement('div');
    selectMenuDescription.classList.add('general-description');
    selectMenuDescription.textContent = description ?? '';

    const selectMenu = document.createElement('div');
    selectMenu.classList.add('select-menu');
    selectMenu.classList.toggle('is-big', isBig);
    selectMenu.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
    });
    selectMenu.appendChild(selectAnimation);
    isBig && hasDescription && selectMenu.appendChild(selectMenuDescription);
    selectMenu.appendChild(optionsFragment);
    !isBig && selectMenu.appendChild(selectButton);
    !isBig && hasDescription && selectMenu.appendChild(selectMenuDescription);

    const selectOverflow = document.createElement('div');
    selectOverflow.classList.add('select-overflow');
    selectOverflow.addEventListener('click', () => closeSelectMenu(false));
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

function parseApkName(name, small = false) {
  switch(name) {
    case 'OctoGram_arm32.apk':
      return small ? 'ARM32' : getStringRef('CHANGELOG_DOWNLOAD_ARM32');
    case 'OctoGram_arm64.apk':
      return small ? 'ARM64' : getStringRef('CHANGELOG_DOWNLOAD_ARM64');
    case 'OctoGram_universal.apk':
      return getStringRef('CHANGELOG_DOWNLOAD_UNIVERSAL');
    case 'OctoGram_x86.apk':
      return small ? 'X86' : getStringRef('CHANGELOG_DOWNLOAD_X86');
    case 'OctoGram_x86_64.apk':
      return small ? 'X86_64' : getStringRef('CHANGELOG_DOWNLOAD_X86_64');
    default:
      return name;
  }
}

function isAndroid() {
  return navigator.userAgent.toLowerCase().includes("android");
}

function tryToGetValidVersion(assetNames) {
  if (isAndroid()) {
    // TRY TO DETECT ABI FROM USERAGENT
    // maybe it works on some cringe browsers
    
    const supportsX64 = navigator.userAgent.includes("x86_64") || navigator.userAgent.includes("x64");
    const supportsX86 = navigator.userAgent.includes("x86");
    const supportsARM64 = navigator.userAgent.includes("aarch64") || navigator.userAgent.includes("arm64");
    const supportsARM32 = navigator.userAgent.includes("armv7");

    for(const name of assetNames) {
      if (name === 'OctoGram_arm32.apk' && supportsARM32) {
        return parseApkName(name, true);
      } else if (name === 'OctoGram_arm64.apk' && supportsARM64) {
        return parseApkName(name, true);
      } else if (name === 'OctoGram_x86.apk' && supportsX86) {
        return parseApkName(name, true);
      } else if (name === 'OctoGram_x86_64.apk' && supportsX64) {
        return parseApkName(name, true);
      }
    }
  }
}

function calculateSize(size, useBinaryUnits = true, addSpace = false) {
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

function getEmojiByIso2(isoString) {
  const codePoint = [...isoString.toUpperCase()].map(char => char.charCodeAt(0) + 127397);
  return String.fromCodePoint(...codePoint);
}

function formatDate(timestamp, format) {
  const date = new Date(timestamp * 1000);

  if (!format) {
    format = 'YY-mm-dd HH:ii:ss';
    if (canUseItalianFormat()) {
      format = 'dd/mm/YY HH:ii:ss';
    }
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
    && window.navigator.language.indexOf('it') !== -1
  );
}

function formatDateUnit(unit) {
  if (unit.toString().length === 1) {
    return '0'+unit;
  } else {
    return unit;
  }
}

function composeUrlBeta(appName) {
  let myUrl = 'https://install.appcenter.ms';
  myUrl += '/orgs/octogramapp/apps/';
  myUrl += appName;
  myUrl += '/distribution_groups/app';
  return myUrl;
}

function clearPage(pageId, onDestroyCallback) {
  if (typeof currentPageOnDestroyCallback != 'undefined') {
    try {
      currentPageOnDestroyCallback();
    } catch(e) {}
  }

  document.body.innerHTML = '';
  currentPageId = pageId;
  currentPageOnDestroyCallback = onDestroyCallback;
  
  parallaxHelper.clearParallaxState();
}

function generateRandomEncrScript(length, addTag = false) {
  const dictionary = [...'0123456789qwertyuiopasdfghjklzxcvbnm!?/\a`~+*=@#$%'];
  let finalString = '';
  for(let i = 0; i < length; i++) {
    finalString += dictionary[Math.floor(Math.random() * dictionary.length)];
  }
  if (addTag) {
    return '<span class="encry">' + finalString + '</span>';
  } else {
    return finalString;
  }
}

export {
  currentPageId,
  fixInjectionTags,
  parseCustomSelectMenu,
  parseApkName,
  isAndroid,
  tryToGetValidVersion,
  calculateSize,
  getEmojiByIso2,
  formatDate,
  composeUrlBeta,
  clearPage,
  generateRandomEncrScript
};