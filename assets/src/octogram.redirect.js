window.addEventListener('load', () => {
  switch(window.location.pathname) {
    case '/appcenter_beta':
    case '/appcenter-beta':
    case '/acbeta':
    case '/beta':
      window.location.href = composeUrl('Octogram-Beta');
    break;
    case '/appcenter_stable':
    case '/appcenter-stable':
    case '/ac':
    case '/acstable':
    case '/stable':
      window.location.href = composeUrl('Octogram');
    break;
  }
});

function composeUrl(appName) {
  let myUrl = 'https://install.appcenter.ms';
  myUrl += '/api/v0.1/apps/octogramapp/';
  myUrl += appName;
  myUrl += '/distribution_groups/app';
  myUrl += '/releases/latest';
  myUrl += '?is_install_page=true';
  return myUrl;
}