window.onload = () => {
  const audioForm = document.getElementById('audio-form');
  audioForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(audioForm);
    // formData.append('audio_file', document.getElementById('audio_file').files[0]);
    // formData.append('output', document.getElementById('output').value);
    // formData.append('task', document.getElementById('task').value);
    // formData.append('language', document.getElementById('language').value);
    // formData.append('word_timestamps', document.getElementById('word_timestamps').value);
    // formData.append('encode', document.getElementById('encode').value);

    console.log(formData);
    return;
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
