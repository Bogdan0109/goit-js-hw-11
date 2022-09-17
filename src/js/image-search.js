import PixabayApiService from './pixabay-service.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import createGalleryMarkup from './gallery-markup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('#load-more-btn'),
};
const pixabayApiService = new PixabayApiService();

new SimpleLightbox('refs.gallery a');
// gallery.on('show.simplelightbox', function () {
//   refresh();
// });

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  pixabayApiService.sumHitsLength = 0;

  if (pixabayApiService.query === '') {
    e.currentTarget.reset();
    clearHitsMarkup();
    loadMoreBtnDisplay('none');
    return;
  }

  loadMoreBtnDisplay('block');
  pixabayApiService.resetPage();
  pixabayApiService
    .axiosArticles()
    .then(hits => {
      clearHitsMarkup();
      appendHitsMarkup(hits);
      Notify.success(`Hooray! We found ${pixabayApiService.totalHits} images.`);
      pixabayApiService.plusHitsLength(hits.length);
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
  pixabayApiService.axiosArticles().then(hits => {
    pixabayApiService.plusHitsLength(hits.length);

    if (pixabayApiService.sumHitsLength === pixabayApiService.totalHits) {
      loadMoreBtnDisplay('none');
      return Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
    appendHitsMarkup(hits);
  });
}

function appendHitsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
}

function clearHitsMarkup() {
  refs.gallery.innerHTML = '';
}

function loadMoreBtnDisplay(display) {
  refs.loadMoreBtn.style.display = `${display}`;
}
