class Translations {
  getStringRef(name) {
    return TRANSLATIONS_REF['en'][name];
  }
}

const translations = new Translations();