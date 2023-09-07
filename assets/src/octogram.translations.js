class Translations {
  #cachedTranslations = {};

  #AVAILABLE_LANGUAGES = [
    'en', 'it', 'id'
  ];

  #TRANSLATIONS_REF = {
    LOADING: 'Loading...',
    
    HEADER_FEATURES: 'Features',
    HEADER_DOWNLOAD: 'Download',
    HEADER_DC_STATUS: 'DC Status',
    HEADER_SOURCE: 'Source',

    INTRODUCTION_PLACEHOLDER: 'Are we ready for 2.0.0?',
    INTRODUCTION_DISCOVER: 'Discover {0}',
    INTRODUCTION_DISCOVER_DESCRIPTION: 'The open-source alternative Telegram client with all the features you\'ve always wanted.',
    FEATURES_TITLE: '{0}\'s features',
    FEATURES_UNAVAILABLE: 'We\'re working on it. It will be available soon.',
    FEATURES_APPEARANCE: 'Appearance',
    FEATURES_APPEARANCE_DATACENTER_ID: 'More user details',
    FEATURES_APPEARANCE_DATACENTER_ID_DESCRIPTION: 'Get at a glance the datacenter to which a user belongs and his user ID.',
    FEATURES_APPEARANCE_ALTERNATIVE_BUTTONS: 'Alternative buttons',
    FEATURES_APPEARANCE_ALTERNATIVE_BUTTONS_DESCRIPTION: 'You choose the appearance of the buttons to keep up with your tastes and have an interface that is always modern.',
    FEATURES_APPEARANCE_EMOJI_SET: 'Emoji set',
    FEATURES_APPEARANCE_EMOJI_SET_DESCRIPTION: 'Choose the emoji pack you prefer. Obviously, the changes only apply to your client. Others will continue to see what they choose.',
    FEATURES_FUNCTIONS: 'Functions',
    FEATURES_FUNCTIONS_REGISTRATION_DATE: 'Registration date',
    FEATURES_FUNCTIONS_REGISTRATION_DATE_DESCRIPTION: 'Find out when your girlfriend created her Telegram account. Unfortunately, in a roundabout way.',
    FEATURES_FUNCTIONS_MESSAGE_DETAILS: 'Message details',
    FEATURES_FUNCTIONS_MESSAGE_DETAILS_DESCRIPTION: 'Discover the most secret details of any message in any chat. Simply activate the option from the settings and press on a message.',
    FEATURES_FUNCTIONS_EXPERIMENTAL_FEATURES: 'Experimental features',
    FEATURES_FUNCTIONS_EXPERIMENTAL_FEATURES_DESCRIPTION: 'If you are very curious or you like risks, use our lab functions. Warning: these functions may make your app unstable or may cause it to crash.',
    FEATURES_DC_STATUS: 'Datacenter status',
    FEATURES_DC_STATUS_DESCRIPTION: 'Stay updated on any lag or internal issues from Telegram. This option is also available online.',
    ADVANTAGES_TITLE: 'Always in step',
    ADVANTAGES_DESCRIPTION: 'A continuously updated client',
    ADVANTAGES_ROWS_1: 'Always up-to-date with official client functions',
    ADVANTAGES_ROWS_2: 'Always in line with Telegram\'s Terms of Service',
    ADVANTAGES_ROWS_3: 'With support for all Telegram Premium features',
    MONET_TITLE: 'Always like you.',
    MONET_DESCRIPTION: 'Keep scrolling to discover the adaptive theme.',
    MONET_TRY: 'Try this theme',
    MONET_FOOTER_TITLE: 'Ready. Steady. Go.',
    MONET_FOOTER_DESCRIPTION: 'Adaptive theme is only available on Android 12+.',
    FOOTER_SITE_TITLE: 'Site pages',
    FOOTER_SITE_FEATURES: 'Features',
    FOOTER_SITE_DOWNLOAD: 'Download',
    FOOTER_SITE_DC_STATUS: 'DC Status',
    FOOTER_SITE_CHANGELOG: 'Changelog',
    FOOTER_SITE_PRIVACYPOLICY: 'Privacy Policy',
    FOOTER_GITHUB_TITLE: 'GitHub links',
    FOOTER_GITHUB_CLIENT_SOURCE: 'Client source',
    FOOTER_GITHUB_CLIENT_LICENSE: 'Client license',
    FOOTER_GITHUB_WEBSITE_SOURCE: 'Website source',
    FOOTER_GITHUB_WEBSITE_LICENSE: 'Website license',
    FOOTER_TELEGRAM_TITLE: 'Telegram links',
    FOOTER_TELEGRAM_NEWS: '[Channel] News',
    FOOTER_TELEGRAM_APKS: '[Channel] Apks',
    FOOTER_TELEGRAM_BETA_APKS: '[Channel] Beta Apks',
    FOOTER_TELEGRAM_SUPPORT: '[Group] Support',
    FOOTER_TEXT_1: 'Fork or edit this website',
    FOOTER_TEXT_2: 'Android 12+ wallpapers are copyrighted by Google.',
  
    DCSTATUS_TITLE: 'Check the Telegram\'s DataCenter status in real time.',
    DCSTATUS_TITLE_PAGE: 'DC Status',
    DCSTATUS_BUTTON: 'Reload status',
    DCSTATUS_SERVER_TITLE: 'Current status',
    DCSTATUS_SERVER_DESCRIPTION: 'Next update in',
    DCSTATUS_SERVER_ADDRESS: 'IP Address',
    DCSTATUS_SERVER_LAST_LAG: 'Last lag',
    DCSTATUS_SERVER_LAST_DOWNTIME: 'Last downtime',
    DCSTATUS_IDENTIFY_TITLE: 'Discover your datacenter',
    DCSTATUS_IDENTIFY_SELECT: 'Select your prefix',
    DCSTATUS_IDENTIFY_RAPID: 'Rapid suggestions',
    
    CHANGELOG_TITLE: 'All latest beta and stable client versions.',
    CHANGELOG_TITLE_PAGE: 'Changelog',
    CHANGELOG_LOADING: 'Loading versions...',
    CHANGELOG_DOWNLOAD_BETA: 'BETA',
    CHANGELOG_DOWNLOAD_STATS: '{0} files, {1} downloads',
    CHANGELOG_DOWNLOAD_ARM32: 'For ARM32 devices',
    CHANGELOG_DOWNLOAD_ARM64: 'For ARM64 devices',
    CHANGELOG_DOWNLOAD_UNIVERSAL: 'Universal',
    CHANGELOG_DOWNLOAD_X86: 'For x86 devices',
    CHANGELOG_DOWNLOAD_X86_64: 'For x86_64 devices',
    CHANGELOG_DOWNLOAD_SUBTITLE: 'If you have doubts, you can also use Universal, which is valid for all devices.',
    CHANGELOG_DOWNLOAD_SUBTITLE_SUGGESTION: 'The {0} version should be the most suitable and stable one for your device.',
    CHANGELOG_DOWNLOAD_SELECT: 'Select your option',
    CHANGELOG_DOWNLOAD_BUTTON: 'Download',

    DOWNLOAD_TITLE: 'Are you ready?',
    DOWNLOAD_DESCRIPTION: 'Choose your version',
    DOWNLOAD_STORES: 'Check other app stores:',
    DOWNLOAD_AVAILABLE: 'Press to open',
    DOWNLOAD_UNAVAILABLE: 'Currently unavailable',
    DOWNLOAD_DIRECTLY: 'Press for download page',

    ERROR_TITLE: 'This page doesn\'t exist.',
    ERROR_DESCRIPTION: 'Looking for an octopus?',
    ERROR_BUTTON: 'I am an octopus',
    
    PRIVACYPOLICY_TITLE: 'Find out how we save and process your personal data',
    PRIVACYPOLICY_TITLE_PAGE: 'Privacy Policy',
    PRIVACYPOLICY_LOADING: 'Loading policy...',
  };

  load() {
    return new Promise((resolve) => {
      const XML = new XMLHttpRequest();
      XML.open('GET', this.#composeUrl(), true);
      XML.send();
      XML.addEventListener('readystatechange', (e) => {
        if (e.target.readyState == 4) {
          if (e.target.status == 200) {
            const response = JSON.parse(e.target.responseText);
            this.#cachedTranslations = response;
          }

          resolve();
        }
      });
    });
  }

  getStringRef(name, ...args) {
    let string = this.#TRANSLATIONS_REF[name];

    if (this.#cachedTranslations[name]) {
      string = this.#cachedTranslations[name];
    }

    if (args.length) {
      const isSortObject = args.some((e) => typeof e == 'object');
			if(isSortObject){
				const splittedString = string.split('{');
				let temporaryString = '';

				for(const part of splittedString){
					if(part[1] == '}' && !isNaN(parseInt(part[0]))){
						const isElement = args[part[0]] instanceof HTMLElement;
						const repartSet = '<smali data-id="'+part[0]+'"></smali>';
						temporaryString += isElement && repartSet || args[part[0]];
						temporaryString += part.slice(2);
					}else{
						temporaryString += part;
					}
				}

				const newGeneratedElement = document.createElement('span');
				newGeneratedElement.classList.add('dynamic-translation');
				newGeneratedElement.innerHTML = temporaryString;
				for(const element of newGeneratedElement.childNodes){
					if(element.tagName == 'SMALI' && element.dataset.id){
						element.replaceWith(args[element.dataset.id]);
					}
				}

				return newGeneratedElement;
			}else{
				for(const [id, arg] of args.entries()){
					string = string.replaceAll('{'+id+'}', arg);
				}
			}
    }

    return string;
  }

  getTextNodeByStringRef(name, ...args) {
    const string = this.getStringRef(name, ...args);
    if (typeof string != 'undefined') {
      if (string instanceof Element && string.tagName == 'SPAN' && string.classList.contains('dynamic-translation')) {
        return string;
      } else {
        return document.createTextNode(string);
      }
    } else {
      return document.createDocumentFragment();
    }
  }

  #getLanguageCode() {
    if (typeof window.navigator.language != 'undefined') {
      for(const lang of window.navigator.language.split('-')) {
        if (this.#AVAILABLE_LANGUAGES.includes(lang.toLowerCase())) {
          return lang.toLowerCase();
        }
      }
    }

    return 'en';
  }

  #composeUrl() {
    let url = 'https://raw.githubusercontent.com';
    url += '/OctoGramApp/assets/lang_packs';
    url += '/LanguageWebSite/';
    url += this.#getLanguageCode();
    url += '.json?cache=';
    url += Math.random().toString();
    return url;
  }
}

const translations = new Translations();