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

// 获取视频元素
const video = document.getElementById('video');

// 创建音频上下文
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 创建视频和音频流
let videoStream;
let audioStream;

// 当视频开始播放时
video.addEventListener('play', () => {
  // 创建MediaStream对象
  const mediaStream = video.captureStream();

  // 分离视频流
  videoStream = new MediaStream(mediaStream.getVideoTracks());

  // 分离音频流
  const audioSource = audioContext.createMediaStreamSource(
    new MediaStream(mediaStream.getAudioTracks())
  );
  const destination = audioContext.createMediaStreamDestination();
  audioSource.connect(destination);
  audioStream = destination.stream;

  // 你可以在这里对audioStream和videoStream进行进一步处理
  console.log('Video Stream:', videoStream);
  console.log('Audio Stream:', audioStream);
});
