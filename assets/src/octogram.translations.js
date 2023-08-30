class Translations {
  #cachedTranslations = {};

  #AVAILABLE_LANGUAGES = [
    'en', 'it'
  ];

  #TRANSLATIONS_REF = {
    INTRODUCTION_DISCOVER: 'Discover',
    INTRODUCTION_DISCOVER_DESCRIPTION: 'The Telegram alternative client with all the features you need.',
    INTRODUCTION_SETTINGS: 'Impostazioni',
    INTRODUCTION_CHAT: 'Chat',
    INTRODUCTION_CHAT_EXPAND: 'and many other features',
    INTRODUCTION_APPEARANCE: 'Appearance',
    INTRODUCTION_APPEARANCE_EXPAND: 'and many other features',
    FEATURES_TITLE: '%s\'s features',
    FEATURES_ALTERNATIVE_BUTTONS: 'Alternative buttons',
    FEATURES_REGISTRATION_DATE: 'Registration date',
    FEATURES_DCID_INDICATOR: 'DC & ID indicator',
    FEATURES_DC_STATUS: 'Datacenter status',
    FEATURES_MESSAGE_DETAILS: 'Message details',
    FEATURES_CUSTOMIZABLE_MENU: 'Customizable menu',
    FEATURES_EXPERIMENTAL_SETTINGS: 'Experimental settings',
    FEATURES_EXTRA_TITLE_1: 'There are also other options.',
    FEATURES_EXTRA_TITLE_2: 'Discover them by downloading the app.',
    FEATURES_EXTRA_BUTTON: 'Download',
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
    CHANGELOG_LOADING: 'Loading versions...',
    CHANGELOG_DOWNLOAD_BETA: 'BETA',
    CHANGELOG_DOWNLOAD_ARM32: 'For ARM32 devices',
    CHANGELOG_DOWNLOAD_ARM64: 'For ARM64 devices',
    CHANGELOG_DOWNLOAD_UNIVERSAL: 'Universal',
    CHANGELOG_DOWNLOAD_X86: 'For x86 devices',
    CHANGELOG_DOWNLOAD_X86_64: 'For x86_64 devices',
    CHANGELOG_DOWNLOAD_SUBTITLE: 'If you have doubts, you can also use Universal, which is valid for all devices.',
    CHANGELOG_DOWNLOAD_SUBTITLE_SUGGESTION: 'The %s version should be the most suitable and stable one for your device.',
    CHANGELOG_DOWNLOAD_SELECT: 'Select your option',
    CHANGELOG_DOWNLOAD_BUTTON: 'Download',
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

  getStringRef(name) {
    if (this.#cachedTranslations[name]) {
      return this.#cachedTranslations[name];
    }

    return this.#TRANSLATIONS_REF[name];
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
    url += '/LanguageWebsite/';
    url += this.#getLanguageCode();
    url += '.json?cache=';
    url += Math.random().toString();
    return url;
  }
}

const translations = new Translations();