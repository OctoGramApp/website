import * as header from "./octogram.header.js";

let parallaxListeners = [];
let registeredEvent = false;

function init() {
  if (!registeredEvent) {
    window.addEventListener('scroll', (e) => handle(e));
    registeredEvent = true;
  }
}

function registerForParallax({
  element,
  basedOnContainer = element,
  ignoreMobileCheck = false,
  set1AfterScroll = false,
  isMonetMainCheck = false,
  onVisible,
  onHidden
}) {
  init();
  parallaxListeners.push({
    element,
    basedOnContainer,
    ignoreMobileCheck,
    set1AfterScroll,
    isMonetMainCheck,
    onVisible,
    onHidden
  });
}

function clearParallaxState() {
  parallaxListeners = [];
}

function handle() {
  for (const listener of parallaxListeners) {
    try {
      if (listener.isMonetMainCheck) {
        reloadItemsAsMonet(listener);
      } else {
        reloadItems(listener);
      }
    } catch(e) {}
  }

  header.reloadBlurState();
}

function reloadItems({
  element,
  basedOnContainer,
  ignoreMobileCheck,
  set1AfterScroll,
  onVisible,
  onHidden
}) {
  const isMobileDevice = !ignoreMobileCheck && window.innerWidth < 1000;
  if (element instanceof Element) {
    const percent = isMobileDevice ? 1 : (calculateVisibleArea(basedOnContainer, set1AfterScroll) / 100);
    element.classList.toggle('visible', percent > 0.8);
    element.style.setProperty('--parallax-state', percent.toString());

    if (percent > 0.8) {
      requestAnimationFrame(onVisible); 
    } else {
      requestAnimationFrame(onHidden);
    }
  }
}

function calculateVisibleArea(element, set1AfterScroll = false) {
  const currentPosition = element.getBoundingClientRect().top;
  const elementHeight = element.getBoundingClientRect().height;

  let percent;

  if (currentPosition > window.innerHeight) {
    percent = 0;
  } else if(currentPosition + elementHeight > window.innerHeight) {
    percent = 100 - (currentPosition + elementHeight - window.innerHeight) * 100 / elementHeight;
  } else if(currentPosition < 0) {
    if (set1AfterScroll) {
      percent = 100;
    } else {
      percent = (currentPosition + elementHeight) * 100 / elementHeight;
    }
  } else {
    percent = 100;
  }

  return Math.min(100, Math.max(0, percent));
}

function reloadItemsAsMonet({ element }) {
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
  element.style.setProperty('--visible-percent', String(visiblePercent));
  element.classList.toggle('visible', parallaxPercent === 1);
  element.classList.toggle('visible-full', visiblePercent === 1);
}

export {
  init,
  registerForParallax,
  handle,
  clearParallaxState,
};