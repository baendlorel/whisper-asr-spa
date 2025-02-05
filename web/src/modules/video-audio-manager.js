const isVideo = (file) => file instanceof File && file.type.includes('video');
const isAudio = (file) => file instanceof File && file.type.includes('audio');

const play = (file, playerElement) => {
  // 创建一个指向文件的URL
  const fileURL = URL.createObjectURL(file);

  // 将URL设置为视频元素的源
  playerElement.src = fileURL;

  // 加载并播放视频
  playerElement.load();
  playerElement.play();
};

/**
 *
 * @param {HTMLVideoElement} videoPlayer
 */
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
