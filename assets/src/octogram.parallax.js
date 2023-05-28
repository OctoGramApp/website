window.addEventListener('scroll', reloadParallax);
window.addEventListener('load', reloadParallax);
window.addEventListener('resize', reloadParallax);

function reloadParallax() {
  reloadItems(
    [
      document.querySelector('body .page .download .content')
    ],
    document.querySelector('body .page .download .content')
  );
  reloadItems(
    document.querySelectorAll('body .page .advantages .items *'),
    document.querySelector('body .page .advantages .items')
  );
  reloadItems(
    document.querySelectorAll('body .page .advantages .message *'),
    document.querySelector('body .page .advantages')
  );
  reloadItems(document.querySelectorAll('body .page .features .list > *'));
}

function reloadItems(item, byContainer) {
  const isMobileDevice = window.innerWidth < 1000;
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