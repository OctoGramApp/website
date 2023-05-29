switch(window.location.pathname) {
  case '/appcenter_beta':
  case '/appcenter-beta':
  case '/acbeta':
  case '/beta':
    window.location.href = composeUrl('octogram-beta');
  break;
  case '/appcenter_stable':
  case '/appcenter-stable':
  case '/ac':
  case '/acstable':
  case '/stable':
    window.location.href = composeUrl('octogram');
  break;
  case '/apkpure':
    window.location.href = 'https://apkpure.com/octogram/it.octogram.android';
  break;
  case '/telegram':
  case '/tg':
    window.location.href = 'https://t.me/octogramapp';
  break;
  case '/github':
  case '/gh':
    window.location.href = 'https://github.com/octogramapp';
  break;
}

function composeUrl(appName) {
  let myUrl = 'https://install.appcenter.ms';
  myUrl += '/orgs/octogramapp/apps/';
  myUrl += appName;
  myUrl += '/distribution_groups/app';
  return myUrl;
}