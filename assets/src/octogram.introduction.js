let isPausedByScroll = false;
let isPausedByUser = false;

window.addEventListener('load', () => {
  const introductionItem = document.querySelector('body .page .introduction .illustration');
  if (introductionItem != null) {
    const imageList = introductionItem.querySelectorAll('.image');
    for (const child of imageList) {
      child.addEventListener('click', () => {
        if (child.classList.contains('active')) {
          isPausedByUser = !isPausedByUser;
          introductionItem.classList.toggle('is-paused', isPausedByUser);
        }
      });
    }

    setInterval(() => {
      if (isPausedByScroll || isPausedByUser) {
        return;
      }
      
      const imageList = introductionItem.querySelectorAll('.image');

      let currentActiveImageId;
      for (const [id, child] of imageList.entries()) {
        if (child.classList.contains('active')) {
          currentActiveImageId = id;
          child.classList.remove('active');
        }
      }

      let newImageId = 0;
      if (typeof currentActiveImageId != 'undefined') {
        newImageId = currentActiveImageId + 1;
        if (imageList.length < (newImageId + 1)) {
          newImageId = 0;
        }
      }

      introductionItem.dataset.state = newImageId + 1;
      imageList[newImageId].classList.add('active');
    }, 3000);
  }
});

window.addEventListener('scroll', () => {
  const introductionItem = document.querySelector('body .page .introduction .illustration');
  if (introductionItem != null) {
    const currentItemPosition = introductionItem.getBoundingClientRect().top;
    isPausedByScroll = currentItemPosition < 0;
  }
});