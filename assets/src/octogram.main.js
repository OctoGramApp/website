window.addEventListener('load', () => {
  const translationsLoadPromise = translations.load();

  const splashScreen = document.querySelector('body > .splash');
  const splashScreenPromise = new Promise((resolve) => {
    splashScreen.addEventListener('animationend', () => {
      resolve();
    }, { once: true });
  });

  Promise.all([
    translationsLoadPromise,
    splashScreenPromise
  ]).then(() => {
    splashScreen.remove();
    
    switch(window.location.pathname) {
      case '/changelog.html':
      case '/changelog':
        changelog.init();
      break;
      case '/dcstatus.html':
      case '/dcstatus':
        dcStatus.init();
      break;
      case '/privacy.html':
      case '/privacy':
        privacyPolicy.init();
      break;
      case '/':
        homePage.init();
      break;
      default:
        errorPage.init();
    }
  });
});