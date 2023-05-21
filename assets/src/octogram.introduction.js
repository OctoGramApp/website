let isPaused = false;

window.addEventListener('load', () => {
  const introductionItem = document.querySelector('body .introduction .illustration');
  if (introductionItem != null) {
    setInterval(() => {
      if (isPaused) {
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

      imageList[newImageId].classList.add('active');
    }, 3000);
  }
});

window.addEventListener('scroll', () => {
  const introductionItem = document.querySelector('body .introduction .illustration');
  if (introductionItem != null) {
    const currentItemPosition = introductionItem.getBoundingClientRect().top;
    isPaused = currentItemPosition < 0;
  }
});