import axios from 'axios';

const API_URL = 'https://pixabay.com/api';
const API_KEY = '36365586-331bc85183b3fd7ba137836b3';
const galleryEl = document.querySelector('.gallery');

const getImages = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: {
        key: API_KEY,
        q: 'yellow flowers',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    });
    const images = response.data.hits;
    return images;
  } catch (error) {
    console.error(error);
  }
};

const makeGallery = async () => {
  try {
    const images = await getImages();
    const markup = images
      .map(image => {
        return `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${image.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${image.downloads}</span>
    </p>
  </div>
</div>
`;
      })
      .join('');
    galleryEl.innerHTML = markup;
  } catch (error) {
    console.error(error);
  }
};

makeGallery();
