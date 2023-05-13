import axios from 'axios';

const API_URL = 'https://pixabay.com/api';
const API_KEY = '36365586-331bc85183b3fd7ba137836b3';
const axios = require('axios');

async function getImages() {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: {
        key: API_KEY,
        q: 'yellow flowers',
        image_type: 'photo',
      },
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

getImages();
