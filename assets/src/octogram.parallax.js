window.addEventListener('scroll', reloadParallax);
window.addEventListener('load', reloadParallax);
window.addEventListener('resize', reloadParallax);

function reloadParallax() {
  reloadItems(
    [
      document.querySelector('body > .page > #download > .download .content')
    ],
    document.querySelector('body > .page > #download > .download .content')
  );
  reloadItems(
    document.querySelectorAll('body > .page > #advantages > .advantages .items *'),
    document.querySelector('body > .page > #advantages > .advantages .items')
  );
  reloadItems(
    document.querySelectorAll('body > .page > #advantages > .advantages .message *'),
    document.querySelector('body > .page > #advantages > .advantages')
  );
  reloadItems(document.querySelectorAll('body > .page > #features > .features .list > *'));
  reloadItems(document.querySelectorAll('body > .page > #monet > .monet-theme-reference > .monet-theme > .example'), undefined, true);
  initMonetReference();
}

function reloadItems(item, byContainer, ignoreMobileCheck = false) {
  const isMobileDevice = !ignoreMobileCheck && window.innerWidth < 1000;
  if (item instanceof Object) {
    if (typeof byContainer == 'undefined') {
      for(const child of item) {
        const percent = isMobileDevice ? 1 : (calculateVisibleArea(child) / 100);
        child.style.setProperty('--parallax-state', percent.toString());
      }
    } else if(byContainer instanceof Element) {
      const percent = isMobileDevice ? 1 : (calculateVisibleArea(byContainer) / 100);
      for(const child of item) {
        child.style.setProperty('--parallax-state', percent.toString());
      }
    }
  }
}

function calculateVisibleArea(element) {
  const currentPosition = element.getBoundingClientRect().top;
  const elementHeight = element.getBoundingClientRect().height;

  let percent;

  if (currentPosition > window.innerHeight) {
    percent = 0;
  } else if(currentPosition + elementHeight > window.innerHeight) {
    percent = 100 - (currentPosition + elementHeight - window.innerHeight) * 100 / elementHeight;
  } else if(currentPosition < 0) {
    percent = (currentPosition + elementHeight) * 100 / elementHeight;
  } else {
    percent = 100;
  }

  return Math.min(100, Math.max(0, percent));
}

function initMonetReference() {
  const element = document.querySelector('body > .page > #monet > .monet-theme-reference');
  if (element != null) {
    const currentPosition = element.getBoundingClientRect().top;
    const elementHeight = element.getBoundingClientRect().height;

    let parallaxPercent;
    let visibleHeight;
    if (currentPosition > window.innerHeight) {
      parallaxPercent = 0;
      visibleHeight = 0;
    } else {
      parallaxPercent = 1 - currentPosition / window.innerHeight;
      parallaxPercent = Math.max(parallaxPercent, 0);
      parallaxPercent = Math.min(parallaxPercent, 1);

      visibleHeight = window.innerHeight - currentPosition;
    }

    let visiblePercent = visibleHeight / elementHeight;
    visiblePercent = Math.max(visiblePercent, 0);
    visiblePercent = Math.min(visiblePercent, 1);

    element.style.setProperty('--parallax-pending', parallaxPercent);
    element.style.setProperty('--visible-height', visibleHeight);
    element.style.setProperty('--visible-percent', visiblePercent);
    element.classList.toggle('visible', parallaxPercent == 1);
    element.classList.toggle('visible-full', visiblePercent == 1);
  }
}