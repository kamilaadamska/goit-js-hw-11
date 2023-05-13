import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_URL = 'https://pixabay.com/api';
const API_KEY = '36365586-331bc85183b3fd7ba137836b3';
const galleryEl = document.querySelector('.gallery');
const formEl = document.getElementById('search-form');
const inputEl = document.querySelector('input[class="form-element"]');

formEl.addEventListener('submit', ev => {
  ev.preventDefault();
  makeGallery(inputEl.value.trim());
});

const getImages = async searchedPhrase => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: {
        key: API_KEY,
        q: `${searchedPhrase}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    });
    if (response.data.hits.length === 0) throw new Error();
    return response.data.hits;
  } catch (error) {
    console.error(error);
  }
};

const makeGallery = async searchedPhrase => {
  try {
    const images = await getImages(searchedPhrase);
    const markup = images
      .map(image => {
        return `<div class="photo-card">
  <a href="${image.largeImageURL}"><img src="${image.webformatURL}" class="photo" alt="${image.tags}" loading="lazy" /></a>
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
    new SimpleLightbox('.gallery a');
  } catch (error) {
    console.error(error);
  }
};
