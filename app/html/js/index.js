const initI18n = () => {
  // 初始化语言
  i18n.init();

  const radios = document.querySelectorAll('input[name=ui-language]');

  for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('click', () => {
      i18n.render(radios[i].value);
    });
  }
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
    // 获取用户选择的文件
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
  // 初始化语言
  initI18n();

  // 挂载超长的语言选择
  initLanguageOption();

  // 监听音视频文件的选择
  initFilePreview();

  // 监听表单
  initAsrPoster();
};
