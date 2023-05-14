import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';

const API_URL = 'https://pixabay.com/api';
const API_KEY = '36365586-331bc85183b3fd7ba137836b3';
const galleryEl = document.querySelector('.gallery');
const formEl = document.getElementById('search-form');
const inputEl = document.querySelector('input[class="form-element"]');
const loadBtn = document.querySelector('.load-more');
const PER_PAGE = 40;
let pageNo;
let totalPages;
let markup;
let searchedPhrase;

formEl.addEventListener('submit', ev => {
  ev.preventDefault();
  markup = '';
  pageNo = 1;
  searchedPhrase = inputEl.value.trim();
  makeGallery(searchedPhrase);
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
        page: pageNo,
        per_page: PER_PAGE,
      },
    });
    if (response.data.hits.length === 0) throw new Error();
    if (searchedPhrase === '') throw new Error();
    if (pageNo === 1) {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    }
    totalPages = Math.ceil(response.data.totalHits / PER_PAGE);
    return response.data;
  } catch (error) {
    console.error(error);
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    markup = '';
    galleryEl.innerHTML = markup;
    loadBtn.classList.add('is-hidden');
  }
};

const makeGallery = async searchedPhrase => {
  try {
    const data = await getImages(searchedPhrase);
    const images = data.hits;
    markup += images
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
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
    loadBtn.classList.remove('is-hidden');
  } catch (error) {
    console.error(error);
  }
};

loadBtn.addEventListener('click', () => {
  loadMore();
});

const loadMore = async () => {
  try {
    loadBtn.classList.add('is-hidden');
    if (totalPages === pageNo) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    pageNo++;
    await makeGallery(searchedPhrase);
    loadBtn.classList.remove('is-hidden');
  } catch {
    console.error(error);
  }
};
