window.addEventListener('load', () => {
  const fakeCard = document.querySelector('body > .page > .card.changelog');
  const cardsContainer = document.querySelector('body > .page > .cards-container');

  if (fakeCard != null && cardsContainer != null) {
    const XML = new XMLHttpRequest();
    XML.open('GET', 'https://api.github.com/repos/OctoGramApp/OctoGram/releases?cache='+Math.random().toString(), true);
    XML.send();
    XML.addEventListener('readystatechange', (e) => {
      if (e.target.readyState == 4 && e.target.status == 200) {
        const response = JSON.parse(e.target.responseText);

        if (response.length > 0) {
          fakeCard.remove();

          const releasesFragment = document.createDocumentFragment();

          for (const release of response) {
            if (!release['assets'].length) {
              continue;
            }

            let selectedOption;
            let downloadsCount = 0;
            let availableOptions = [];
            for(const asset of release['assets']) {
              downloadsCount += asset['download_count'];
              availableOptions.push({
                id: asset['id'],
                title: parseApkName(asset['name']),
                description: calculateSize(asset['size'], false)
              });
            }

            const title = document.createElement('div');
            title.classList.add('title');
            title.appendChild(document.createTextNode(release['name']));

            if (release['prerelease']) {
              const titleBadge = document.createElement('span');
              titleBadge.classList.add('badge');
              titleBadge.textContent = 'BETA';
              title.appendChild(titleBadge);
            }

            const description = document.createElement('div');
            description.classList.add('description');
            description.textContent = release['assets'].length+' files, '+downloadsCount+' downloads';

            const descriptor = document.createElement('div');
            descriptor.classList.add('descriptor');
            descriptor.appendChild(title);
            descriptor.appendChild(description);

            const message = document.createElement('div');
            message.classList.add('message');
            message.innerHTML = fixInjectionTags(release['body']);
            
            const selectValue = document.createElement('span');
            selectValue.classList.add('value');
            selectValue.textContent = 'Select your option';
            const selectIcon = document.createElement('img');
            selectIcon.classList.add('icon');
            selectIcon.src = '/assets/icons/arrowright.svg';
            const select = document.createElement('div');
            select.classList.add('select');
            select.appendChild(selectValue);
            select.appendChild(selectIcon);
            const button = document.createElement('div');
            button.classList.add('button', 'big', 'accent');
            button.classList.add('disabled');
            button.textContent = 'Download';
            const download = document.createElement('div');
            download.classList.add('download');
            download.appendChild(select);
            download.appendChild(button);

            const body = document.createElement('div');
            body.classList.add('body');
            body.appendChild(message);
            body.appendChild(download);

            const content = document.createElement('div');
            content.classList.add('content');
            content.appendChild(descriptor);
            content.appendChild(body);
            const card = document.createElement('div');
            card.classList.add('card', 'changelog');
            card.appendChild(content);

            parseCustomSelectMenu(select, availableOptions, (id) => {
              selectedOption = id;
  
              for(const option of availableOptions) {
                if (option.id == id) {
                  selectValue.textContent = option.title;
                  button.classList.remove('disabled');
                  break;
                }
              }
            });

            button.addEventListener('click', () => {
              for(const asset of release['assets']) {
                if (asset['id'] == parseInt(selectedOption)) {
                  window.location.href = asset['browser_download_url'];
                }
              }
            });
            
            releasesFragment.append(card);
          }

          cardsContainer.replaceWith(releasesFragment);
        }
      }
    });
  }
});