const DATACENTER_NAMES = [
  'DC1 - MIA, Miami FL, USA',
  'DC2 - AMS, Amsterdam, NL',
  'DC3 - MIA, Miami FL, USA',
  'DC4 - AMS, Amsterdam, NL',
  'DC5 - SIN, Singapore, SG'
];

const DATACENTER_IPS = [
  '149.154.175.50',
  '149.154.167.50',
  '149.154.175.100',
  '149.154.167.91',
  '91.108.56.100'
];

const DATACENTER_VIDEOS = [
  'https://cdn1.telegram-cdn.org/file/bf95deaca3.mp4?token=FlDucc6Rtx9e54tGUZ8I6XC5T-OnRD-dekkUIvy2G_4hcRreQGdXjdHfknkK_IfSbGwWcHN5CC_yxh3bNzNKsMLBnPDSR0tmK9GQSd9bDQd8wgncWu0UepE7A2PVDTpljv6I5uMv9Zh98iGopRWWJn-qddj5pdGT7uklFsKE9p6Mmkm7zpEs52jt4CMOLkzy4_FCEztdbry3b4GBkOiimVInRik_mIoYmmcq_v3Y6cd-Ti8oIvFh-moP8GLBCPMiN9fk3ewtayDlZfxn-ciHSzy0jbsRRY-2IbMW2B98aG6Zzz6tSsv16r4zhF7AD4cRGw14b3L-tW2XrugQYqAXrA',
  'https://cdn4.telegram-cdn.org/file/3533ee5e2c.mp4?token=ZL130xJ8SMayFNZhI8XPFypRjuU512Dg7NkdTFpzpSV6FZ22jVP5wkHmL_OGfILFYKG5AzMN5SuDquo2o2hXdevCjKU6Dxest-T87WaELoz4MwiGwXfp8mBI6BJ5tWZKZZKDtpxgtLBw-vMv0KgtMyp46HdvP33A1EMIpLcYe-xNvgcFhZrhqgrlsAfiloPvP2qabWKrLaUgSAhK8SDxeD3-MO8Wgfqc15wyWflcnj2lREE765AjeaSnYx0Zb51qu-GyrGLXt8RWRHiBkcvvlCvWviSdxZJt7GgEi7R600HLSyjxM6yCkMPMCAEYO-2t-8GzIVdcmP8uMMV-hG_raw',
  'https://cdn1.telegram-cdn.org/file/cc005af1a1.mp4?token=pk0TdyvBXZxUOJFDnE5Loq1HsJD8oxuEEryyUeNzHqAMnpJGcg7VdLI6sgKt2S1cv1b0_gShUmeNJq6lrzvmkhFPqnQg8R9re3rNHphjWpfkcbMQ9NJre2pB1tB0dbqqfM7XfdHssXZDnR1T8Qq_nZr8GfDKEZrvo9Ik_xbaLjc9l79nyaJ5gnmgQATzjfFOAx2DKE5b9J8a2vZnYoao1qjTc0cHqM64oEMwAyTOQKKvb-ChGgIHrJ_m2LlJ74-un4HTd0Ehmm8GEC00B_gzc29LMjUrjdK_f2wImUkxFwPXNzAWNw5IanE0F0jJAaFILpsrpU6Nx6bUT-Sb75pD-A',
  'https://cdn4.telegram-cdn.org/file/7ce170308e.mp4?token=HtGukbU1YOvGkIry7iMrwz2fFdOV_wQVVpRSkBI-ULfiCs1EorYNKq-DNdHlQmDE_1h_eJEqX476g1LbYet85wsC01abvXvWXsNwitwh1owI-ElM6h2oxJiif-t7LaYGIDRpiWTzDll8YOKUFnQx4M3_Zh8g4rBTVHdh1Azce6ANxeWvMfvstVCe5M94WV7bdKcRkk1nf5ewl0CBw15VObeZlP5GCcObpsDbydxY6TYk_3BMsHGasm7EPU30mYiQqIKcP7ebBfSJW7BH-y2IIZeV-bpN1024lyjq__LU8sKYm6C30Y0ILNvGjYfynXQb8OfEJe2i36Gb4rtnRItGpA',
  'https://cdn5.telegram-cdn.org/file/da80ebce56.mp4?token=Dscj02o3EX1q87l1eaSjCQ0Vt_DE7LL_DNOdqdxSWTk4NsRimTP4448NCT3LbLA2Vz6F_QgcdVAmAvezbMiqiJczn1r0YZsqL5Tn0V5gf_VF6lA9ViFANqN2muMWasx5uYxskrf3W3pho34wht7MvzncchPFClRmRNJq_ca7Qz_kpSyw1mco21fFkCPUhH-21ZI0SOhF4hubSk0n1FPnTxY23QJeuLRAOxjLIswWYazwNObq1YLSd0pZGhJ6Cs43njLgBpvyq7xrcIERXvSolHPLAppOtRQry7jOvYvvNghif6M3gXUjASqRIRWbR1CL1WkHwr8g8LY9NRUfcrd3KA'
];

const DATACENTER_COUNT = 5;
let currentTimeout;
let currentInterval;
let isLoading = false;

window.addEventListener('load', () => {
  reloadState();
  reloadClientState();

  const reloadButton = document.querySelector('body .page .pointer .message .button');
  if (reloadButton != null) {
    reloadButton.addEventListener('click', () => {
      executeForceReload();
    });
  }
});

function reloadState() {
  const bodyItem = document.querySelector('body .page .card.server .content .datacenters');
  if (bodyItem != null && !isLoading) {
    isLoading = true;
    const XML = new XMLHttpRequest();
    XML.open('GET', 'https://raw.githubusercontent.com/null-nick/SomeExperiments/main/DcStatus/dc_status.json?2', true);
    XML.send();
    XML.addEventListener('readystatechange', (e) => {
      if (e.target.readyState == 4 && e.target.status == 200) {
        const response = JSON.parse(e.target.responseText);
        
        if (typeof response.status != 'undefined') {
          const fragment = document.createDocumentFragment();

          for(const datacenter of response.status) {
            if (datacenter.dc_id <= DATACENTER_COUNT) {
              const datacenterBackground = document.createElement('div');
              datacenterBackground.classList.add('background');
              const datacenterIcon = document.createElement('img');
              datacenterIcon.src = 'assets/icons/datacenters/dc'+datacenter.dc_id+'.svg';
              const datacenterIconContainer = document.createElement('div');
              datacenterIconContainer.classList.add('icon');
              datacenterIconContainer.appendChild(datacenterBackground);
              datacenterIconContainer.appendChild(datacenterIcon);

              const datacenterName = document.createElement('div');
              datacenterName.classList.add('name');
              datacenterName.textContent = DATACENTER_NAMES[datacenter.dc_id - 1];
              const datacenterIp = document.createElement('div');
              datacenterIp.classList.add('ip');
              datacenterIp.textContent = DATACENTER_IPS[datacenter.dc_id - 1];
              const datacenterStatus = composeStatus(datacenter);
              const datacenterDescription = document.createElement('div');
              datacenterDescription.classList.add('description');
              datacenterDescription.appendChild(datacenterName);
              datacenterDescription.appendChild(datacenterIp);
              datacenterDescription.appendChild(datacenterStatus);

              const datacenterRow = document.createElement('div');
              datacenterRow.classList.add('datacenter');
              datacenterRow.dataset.id = datacenter.dc_id;
              datacenterRow.appendChild(datacenterIconContainer);
              datacenterRow.appendChild(datacenterDescription);

              fragment.append(datacenterRow);
            }
          }

          bodyItem.innerHTML = '';
          bodyItem.appendChild(fragment);
          isLoading = false;
          initReload();
        }
      }
    });
  }
}

function initReload() {
  const loadingItem = document.querySelector('body .page .card.server .content .descriptor .description');
  const leftSeconds = document.querySelector('body .page .card.server .content .descriptor .description .seconds');
  if (loadingItem != null && leftSeconds != null) {
    loadingItem.classList.add('definite');

    let currentLeftSeconds = 30;

    const updateState = () => {
      currentLeftSeconds--;

      if (currentLeftSeconds > 0) {
        const percent = (100 * currentLeftSeconds) / 30;
        loadingItem.style.setProperty('--percent', percent);
        leftSeconds.textContent = currentLeftSeconds;
      } else {
        clearInterval(currentInterval);
        executeForceReload();
      }
    };

    if (typeof currentInterval != 'undefined') {
      clearInterval(currentInterval);
    }

    currentInterval = setInterval(updateState, 1000);
    updateState();
  }
}

function executeForceReload() {
  const loadingItem = document.querySelector('body .page .card.server .content .descriptor .description');
  if (loadingItem != null) {
    loadingItem.classList.remove('definite');
    loadingItem.style.setProperty('--percent', 100);

    if (typeof currentTimeout != 'undefined') {
      clearTimeout(currentTimeout);
    }

    currentTimeout = setTimeout(() => {
      clearTimeout(currentTimeout);
      reloadState();
    }, 1400);
  }
}

function composeStatus(datacenter) {
  const datacenterStatus = document.createElement('div');
  datacenterStatus.classList.add('status');

  switch(datacenter.dc_status) {
    case 0:
      datacenterStatus.classList.add('offline');
      datacenterStatus.textContent = 'Offline';
    break;
    case 1:
      datacenterStatus.classList.add('online');
      datacenterStatus.textContent = 'Available';
    break;
    case 2:
      datacenterStatus.classList.add('slow');
      datacenterStatus.textContent = 'Slow';
    break;
  }

  datacenterStatus.textContent += ', Ping: '+datacenter.ping+'ms';

  return datacenterStatus;
}

function reloadClientState() {
  const bodyItem = document.querySelector('body .page .card.client .content .datacenters .report');
  if (bodyItem != null) {
    const fragment = document.createDocumentFragment();

    for(const [id, video] of DATACENTER_VIDEOS.entries()) {
      const date = new Date();
      const videoElement = document.createElement('video');
      videoElement.setAttribute('crossorigin', 'anonymous');
      videoElement.setAttribute('autoplay', 'true');
      videoElement.setAttribute('loop', 'true');
      videoElement.toggleAttribute('disablepictureinpicture');
      videoElement.toggleAttribute('disableremoteplayback');
      videoElement.toggleAttribute('playsinline');
      videoElement.addEventListener('canplay', () => {
        const finalDate = new Date();
        const dateDifference = finalDate.getTime() - date.getTime();

        datacenterStatus.classList.add('online');
        datacenterStatus.textContent = 'Available';
        datacenterPing.textContent = dateDifference+'ms';
      }, { once: true });
      videoElement.src = video;
      
      const datacenterStatus = document.createElement('div');
      datacenterStatus.classList.add('status');
      const datacenterPing = document.createElement('div');
      datacenterPing.classList.add('ping');

      const datacenterColumn = document.createElement('div');
      datacenterColumn.classList.add('column');
      datacenterColumn.dataset.id = id + 1;
      datacenterColumn.appendChild(videoElement);
      datacenterColumn.appendChild(datacenterStatus);
      datacenterColumn.appendChild(datacenterPing);
      fragment.append(datacenterColumn);
    }

    bodyItem.innerHTML = '';
    bodyItem.append(fragment);
  }
}