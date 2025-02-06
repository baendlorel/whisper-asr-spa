export const isVideo = (file: any) => file instanceof File && file.type.includes('video');

export const isAudio = (file: any) => file instanceof File && file.type.includes('audio');

export const play = (file: File, player: HTMLMediaElement) => {
  // 创建一个指向文件的URL
  const fileURL = URL.createObjectURL(file);

  // 将URL设置为元素的源
  player.src = fileURL;

  // 加载并播放
  player.load();
  player.play();
};

const getAudioStream = (videoPlayer) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  /**
   * @type {MediaStream}
   */
  const mediaStream = videoPlayer.captureStream();
  console.log('mediaStream', mediaStream);

  // const tracks = mediaStream.getAudioTracks();

  // 分离音频流
  const audioSource = audioContext.createMediaStreamSource(mediaStream);
  const destination = audioContext.createMediaStreamDestination();
  audioSource.connect(destination);

  const audioStream = destination.stream;
  console.log('Audio Stream:', audioStream);

  const buffer = audioContext.createBuffer();

  const blob = new Blob(buffer);

  const file = new File(blob, 'a.mp3');

  console.log({ buffer, blob, file });
};

export const loadAudioBuffer = async (file: File): Promise<AudioBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target && event.target.result;
      if (arrayBuffer === null) {
        console.log(event);
        reject('LoadFile arrayBuffer is empty');
        return;
      }
      if (typeof arrayBuffer === 'string') {
        console.log(event);
        reject('LoadFile arrayBuffer is string');
        return;
      }

      const audioCtx = new AudioContext();
      audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
        console.log('audioBuffer', audioBuffer);
        resolve(audioBuffer);
      });
    };
    reader.readAsArrayBuffer(file);
  });
