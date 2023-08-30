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
    homePage.init();
  });
});