class ParallaxHelper {
  #parallaxListeners = [];
  #registeredEvent = false;

  init() {
    if (!this.#registeredEvent) {
      window.addEventListener('scroll', (e) => this.#handle(e));
      this.#registeredEvent = true;
    }
  }

  registerForParallax({
    element,
    basedOnContainer = element,
    ignoreMobileCheck = false,
    set1AfterScroll = false,
    isMonetMainCheck = false,
    onVisible,
    onHidden
  }) {
    this.init();
    this.#parallaxListeners.push({
      element,
      basedOnContainer,
      ignoreMobileCheck,
      set1AfterScroll,
      isMonetMainCheck,
      onVisible,
      onHidden
    });
  }

  clearParallaxState() {
    this.#parallaxListeners = [];
  }

  #handle() {
    for (const listener of this.#parallaxListeners) {
      try {
        if (listener.isMonetMainCheck) {
          this.#reloadItemsAsMonet(listener);
        } else {
          this.#reloadItems(listener);
        }
      } catch(e) {}
    }

    header.reloadBlurState();
  }
  
  #reloadItems({
    element,
    basedOnContainer,
    ignoreMobileCheck,
    set1AfterScroll,
    onVisible,
    onHidden
  }) {
    const isMobileDevice = !ignoreMobileCheck && window.innerWidth < 1000;
    if (element instanceof Element) {
      const percent = isMobileDevice ? 1 : (this.#calculateVisibleArea(basedOnContainer, set1AfterScroll) / 100);
      element.classList.toggle('visible', percent > 0.8);
      element.style.setProperty('--parallax-state', percent.toString());

      if (percent > 0.8) {
        requestAnimationFrame(onVisible); 
      } else {
        requestAnimationFrame(onHidden);
      }
    }
  }

  #calculateVisibleArea(element, set1AfterScroll = false) {
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

  #reloadItemsAsMonet({ element }) {
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

const parallaxHelper = new ParallaxHelper();