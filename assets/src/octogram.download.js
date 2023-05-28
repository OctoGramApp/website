window.addEventListener('load', () => {
  const downloadFiles = document.querySelector('body .page .download .content .files');
  if (downloadFiles != null) {
    const selectElement = downloadFiles.querySelector('select');
    const buttonElement = downloadFiles.querySelector('.button');
    if (selectElement != null && buttonElement != null) {
      buttonElement.addEventListener('click', () => {
        let finalUrl = 'https://github.com';
        finalUrl += '/OctoGramApp';
        finalUrl += '/OctoGram';
        finalUrl += '/releases';
        finalUrl += '/download';
        finalUrl += '/%23stable';
        finalUrl += '/'+selectElement.value;

        window.location.href = finalUrl;
      });
    }
  }
});