class DCStatus {
  init() {
    utils.clearPage('dcstatus');

    const pageContainer = document.createElement('div');
    pageContainer.classList.add('page');
    pageContainer.appendChild(header.createElement(() => homePage.init()));
    pageContainer.appendChild(this.#generatePointer());
    pageContainer.appendChild(footer.createElement());

    document.body.appendChild(pageContainer);
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
}

const dcStatus = new DCStatus();