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
