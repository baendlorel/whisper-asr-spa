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
