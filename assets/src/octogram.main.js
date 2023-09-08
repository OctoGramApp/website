window.addEventListener('load', () => {
  const REDIRECT_URIS = [
    {
      paths: ['/appcenter_beta', '/appcenter-beta', '/acbeta', '/beta'],
      url: utils.composeUrlBeta('octogram-beta')
    },
    {
      paths: ['/appcenter_stable', '/appcenter-stable', '/ac', '/acstable', '/stable'],
      url: utils.composeUrlBeta('octogram')
    },
    {
      paths: ['/apkpure'],
      url: 'https://apkpure.com/octogram/it.octogram.android'
    },
    {
      paths: ['/telegram', '/tg'],
      url: 'https://t.me/octogramapp'
    },
    {
      paths: ['/github', '/gh'],
      url: 'https://github.com/octogramapp'
    }
  ];

  document.body.classList.toggle('disable-blur', utils.isAndroid());

  const splashScreen = document.querySelector('body > .splash');
  const isRedirect = REDIRECT_URIS.some((x) => x.paths.includes(window.location.pathname));
  const translationsLoadPromise = translations.load();

  let bottomText;
  if (isRedirect) {
    bottomText = document.createElement('div');
    bottomText.classList.add('bottom-text');
    bottomText.textContent = translations.getStringRef('LOADING');
    splashScreen.appendChild(bottomText);

    translationsLoadPromise.then(() => {
      bottomText.textContent = translations.getStringRef('LOADING');
    });
  }

  const splashScreenPromise = new Promise((resolve) => {
    splashScreen.addEventListener('animationend', (e) => {
      if (typeof bottomText != 'undefined' && bottomText == e.target) {
        return;
      }
      
      resolve();
    });
  });

  Promise.all([
    translationsLoadPromise,
    splashScreenPromise
  ]).then(() => {
    if (isRedirect) {
      for(const { url, paths } of REDIRECT_URIS) {
        if (paths.includes(window.location.pathname)) {
          window.location.href = url;
        }
      }
    } else {
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
        case '/apkpure':
        default:
          errorPage.init();
      }
    }
  });
});