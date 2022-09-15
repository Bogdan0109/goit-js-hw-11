import PixabayApiService from './pixabay-service.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('#load-more-btn'),
};
const pixabayApiService = new PixabayApiService();

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (pixabayApiService.query === '') {
    e.currentTarget.reset();
    clearHitsMarkup();
    return;
  }

  pixabayApiService.resetPage();
  pixabayApiService
    .axiosArticles()
    .then(hits => {
      clearHitsMarkup();
      appendHitsMarkup(hits);
    })
    .catch(error => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      console.log('catch сработал');
      console.error(error);
    });
  e.currentTarget.reset();
}

function onLoadMore(e) {
  pixabayApiService.axiosArticles().then(appendHitsMarkup);
}

function appendHitsMarkup(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
                  <img src="${webformatURL}" alt="${tags}" width="360" height="240" loading="lazy" />
                  <div class="info">
                    <p class="info-item">
                      <b>Likes</b> ${likes}
                    </p>
                    <p class="info-item">
                      <b>Views</b> ${views}
                    </p>
                    <p class="info-item">
                      <b>Comments</b> ${comments}
                    </p>
                    <p class="info-item">
                      <b>Downloads</b> ${downloads}
                    </p>
                  </div>
                </div>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearHitsMarkup() {
  refs.gallery.innerHTML = '';
}
