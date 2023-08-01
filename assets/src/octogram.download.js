window.addEventListener('load', () => {
  const ANIMATION_ICON_NAMES = [
    'appearance',
    'chats',
    'dev',
    'server',
    'settings',
    'datacenters/dc1',
    'datacenters/dc2',
    'datacenters/dc3',
    'datacenters/dc4',
    'datacenters/dc5'
  ];

  const downloadPlaceholder = document.querySelector('body > .page > #download > .download .placeholder');
  if (downloadPlaceholder != null) {
    let availableSlots = [];
    for(let i = 0; i < 3; i++){
      for(const icon of ANIMATION_ICON_NAMES) {
        const animatedElement = document.createElement('img');
        animatedElement.classList.add('animated-icon');
        animatedElement.addEventListener('animationend', () => {
          animatedElement.classList.remove('animated');
        });
        animatedElement.src = '/assets/icons/'+icon+'.svg';
        downloadPlaceholder.appendChild(animatedElement);
        availableSlots.push(animatedElement);
      }
    }

    let lastAtLeft = false;
    setInterval(() => {
      for(const element of availableSlots) {
        if (!element.classList.contains('animated')) {
          lastAtLeft = !lastAtLeft;

          let xPosition;
          if (lastAtLeft) {
            xPosition = Math.floor(Math.random() * (15 + 1));
          } else {
            const minimumLeftPosition = (100 - 15);
            xPosition = Math.floor(Math.random() * (100 - minimumLeftPosition + 1)) + minimumLeftPosition;
          }

          const rotatePosition = Math.floor(Math.random() * (100 + 1)) - 50;
          element.style.setProperty('--x-position', xPosition);
          element.style.setProperty('--rotation', rotatePosition+'deg');
          element.classList.add('animated');
          break;
        }
      }
    }, 350);
  }

  const generalContent = document.querySelector('body > .page > #download > .download .content');
  const downloadFiles = document.querySelector('body > .page > #download > .download .content .files');
  if (downloadFiles != null && generalContent != null && generalContent.classList.contains('unavailable-apk')) {
    let cachedResponse = [];
    let availableOptions = {};
    let selectedOption;
    const selectElement = downloadFiles.querySelector('.select');
    const selectElementSpan = selectElement.querySelector('span');

    const XML = new XMLHttpRequest();
    XML.open('GET', 'https://api.github.com/repos/OctoGramApp/OctoGram/releases/latest?cache='+Math.random().toString(), true);
    XML.send();
    XML.addEventListener('readystatechange', (e) => {
      if (e.target.readyState == 4 && e.target.status == 200) {
        const response = JSON.parse(e.target.responseText);

        if (response['assets'].length) {
          cachedResponse = response['assets'];

          for(const asset of response['assets']) {
            availableOptions[asset['id']] = parseApkName(asset['name']);
          }

          parseCustomSelectMenu(selectElement, availableOptions, (id) => {
            selectedOption = id;
            selectElementSpan.textContent = availableOptions[id];
          });
          generalContent.classList.remove('unavailable-apk');
        }
      }
    });

    const buttonElement = downloadFiles.querySelector('.button');
    if (buttonElement != null) {
      buttonElement.addEventListener('click', () => {
        for(const asset of cachedResponse) {
          if (asset['id'] == parseInt(selectedOption)) {
            window.location.href = asset['browser_download_url'];
          }
        }
      });
    }
  }
});

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
          }
        });
      }
    }

    let i = 0;
    const optionsFragment = document.createDocumentFragment();
    for(const id in availableOptions) {
      i++;

      const radioOption = document.createElement('div');
      radioOption.classList.add('radio');
      radioOption.classList.toggle('selected', lastSelectedOption == id);

      const optionTitle = document.createElement('div');
      optionTitle.classList.add('optiontitle');
      optionTitle.textContent = availableOptions[id];

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

      optionsFragment.append(option);

      if (lastSelectedOption == id) {
        radioOption.classList.add('selected');
        currentSelectedOption = radioOption;
      }
    }

    const selectAnimation = document.createElement('img');
    selectAnimation.classList.add('animation');
    selectAnimation.src = '/assets/animations/bornAnimation.gif';

    const selectButton = document.createElement('div');
    selectButton.classList.add('button', 'big', 'accent');
    selectButton.addEventListener('click', () => {
      if (typeof lastSelectedOption != 'undefined') {
        callback(lastSelectedOption);
      }
      
      closeSelectMenu();
    });
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
    selectOverflow.addEventListener('click', () => {
      closeSelectMenu();
    });
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