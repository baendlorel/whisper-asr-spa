import axios from 'axios';

class WasService {
  async asr(args: any) {
    return await axios.post('/was/asr', args, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default new WasService();
