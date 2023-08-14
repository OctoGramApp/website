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
      if (!document.hasFocus()) {
        return;
      }

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

    const XML = new XMLHttpRequest();
    XML.open('GET', 'https://api.github.com/repos/OctoGramApp/OctoGram/releases?cache='+Math.random().toString(), true);
    XML.send();
    XML.addEventListener('readystatechange', (e) => {
      if (e.target.readyState == 4 && e.target.status == 200) {
        const response = JSON.parse(e.target.responseText);

        if (response.length) {
          cachedResponse = response[0];
          if (cachedResponse['prerelease']) {
            for(const release of response) {
              if (!release['prerelease']) {
                cachedResponse = release;
                break;
              }
            }
          }

          let sizeSum = 0;
          for(const asset of cachedResponse['assets']) {
            sizeSum += asset['size'];
          }
          sizeSum /= cachedResponse['assets'].length;
          
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
          rightContainerTitle.textContent = cachedResponse['name'];
          const rightContainerDescription = document.createElement('div');
          rightContainerDescription.classList.add('description');
          rightContainerDescription.textContent = 'Press for download page';
          const rightContainer = document.createElement('div');
          rightContainer.classList.add('right-container');
          rightContainer.appendChild(rightContainerTitle);
          rightContainer.appendChild(rightContainerDescription);

          generalContent.classList.remove('unavailable-apk');
          downloadFiles.appendChild(fileIconContainer);
          downloadFiles.appendChild(rightContainer);
        }
      }
    });
  }
});