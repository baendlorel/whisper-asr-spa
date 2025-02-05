const initI18n = () => {
  // 初始化语言
  i18n.init();

  const currentLanguage = i18n.getCurrentUILanguage();
  const radios = document.querySelectorAll('input[name=ui-language]');

  for (let i = 0; i < radios.length; i++) {
    const r = radios[i];

    // 设置选中
    if (r.value === currentLanguage) {
      r.setAttribute('checked', '');
    } else {
      r.removeAttribute('checked');
    }

    // 监听
    r.addEventListener('click', () => {
      i18n.render(r.value);
    });
  }
};

const initFileSelector = () => {
  /**
   * @type {HTMLButtonElement}
   */
  const fileSelector = document.getElementById('file-selector');

  /**
   * @type {HTMLLabelElement}
   */
  const fileLabel = document.getElementById('file-label');

  /**
   * @type {HTMLInputElement}
   */
  const fileInput = document.getElementById('audio_file');

  fileSelector.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];

    if (!file) {
      console.log('未选择文件');
      return;
    }

    fileLabel.textContent = file.name;
  });
};

const initFilePreview = () => {
  /**
   * @type {HTMLInputElement}
   */
  const fileInput = document.getElementById('audio_file');

  /**
   * @type {HTMLVideoElement}
   */
  const videoPlayer = document.getElementById('video-player');

  /**
   * @type {HTMLAudioElement}
   */
  const audioPlayer = document.getElementById('audio-player');

  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];

    if (!file) {
      console.log('未选择文件');
      return;
    }

    audioPlayer.style.display = 'none';
    videoPlayer.style.display = 'none';

    audioPlayer.pause();
    videoPlayer.pause();

    if (isAudio(file)) {
      audioPlayer.style.display = '';
      play(file, audioPlayer);
    }

    if (isVideo(file)) {
      videoPlayer.style.display = '';
      play(file, videoPlayer);
      getAudioStream(videoPlayer);
    }
  });
};

const initAsrPoster = () => {
  const asr = document.getElementById('asr');
  asr.addEventListener('click', (event) => {
    const audioForm = document.getElementById('audio-form');
    const formData = new FormData(audioForm);

    if (formData.get('language') === '') {
      formData.delete('language');
    }

    const file = formData.get('audio_file');
    if (!isAudio(file) && !isVideo(file)) {
      alert('不是音视频文件');
      return;
    }

    formData.forEach((v, k) => {
      console.log(k, v);
    });

    fetch('/was/asr', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        alert('Request sent successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Error sending request.');
      });
  });
};

window.onload = () => {
  initI18n();

  initLanguageOption();

  initFileSelector();

  initFilePreview();

  initAsrPoster();
};
