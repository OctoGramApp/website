import {
  composeUrlBeta, isAndroid
} from "./octogram.utils.js";
import * as translations from "./octogram.translations.js";
import * as parallaxHelper from "./octogram.parallax.js";
import * as changelog from "./octogram.changelog.js";
import * as dcStatus from "./octogram.dcstatus.js";
import * as privacyPolicy from "./octogram.privacy.js";
import * as monet from "./octogram.monet.js";
import * as homePage from "./octogram.home.js";
import * as errorPage from "./octogram.errorpage.js";

window.addEventListener('load', () => {
  const REDIRECT_URIS = [
    {
      paths: ['/appcenter_beta', '/appcenter-beta', '/acbeta', '/beta'],
      url: composeUrlBeta('octogram-beta')
    },
    {
      paths: ['/appcenter_stable', '/appcenter-stable', '/ac', '/acstable', '/stable'],
      url: composeUrlBeta('octogram')
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
    },
    {
      paths: ["/ghi", "/ghissue", "/gh_i", "/gh_issue"],
      url: 'https://github.com/OctoGramApp/OctoGram/issues/new/choose'
    },
  ];

  document.body.classList.toggle('disable-blur', isAndroid());

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
      if (typeof bottomText != 'undefined' && bottomText === e.target) {
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
      parallaxHelper.init();

      switch(window.location.pathname) {
        case '/changelog.html':
        case '/changelog':
          changelog.init();
        break;
        case '/dcstatus.html':
        case '/dcstatus':
        case '/dc':
          dcStatus.init();
        break;
        case '/privacy.html':
        case '/privacy':
          privacyPolicy.init();
        break;
        case '/monet.html':
        case '/monet':
          monet.init();
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
