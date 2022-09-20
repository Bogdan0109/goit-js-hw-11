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

const gallery = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  scrollToTop();

  pixabayApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  pixabayApiService.sumHitsLength = 0;

  if (pixabayApiService.query === '') {
    e.currentTarget.reset();
    clearHitsMarkup();
    loadMoreBtnDisplay('none');
    return;
  }
  e.currentTarget.reset();
  loadMoreBtnDisplay('block');

  pixabayApiService.resetPage();

  try {
    const { hits, totalHits } = await pixabayApiService.axiosArticles();
    clearHitsMarkup();
    appendHitsMarkup(hits);
    Notify.success(`Hooray! We found ${totalHits} images.`);
    pixabayApiService.plusHitsLength(hits.length);
    // pixabayApiService
    //   .axiosArticles()
    //   .then(hits => {
    //     clearHitsMarkup();
    //     appendHitsMarkup(hits);
    //     Notify.success(
    //       `Hooray! We found ${pixabayApiService.totalHits} images.`
    //     );
    //     pixabayApiService.plusHitsLength(hits.length);
    //   })
    // .catch(error => {
    //   Notify.failure(
    //     'Sorry, there are no images matching your search query. Please try again.'
    //   );
    //   console.log('catch сработал');
    //   console.error(error);
    // });
  } catch {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    console.log('catch сработал');
    console.error(error);
  }
}

async function onLoadMore(e) {
  try {
    const { hits, totalHits } = await pixabayApiService.axiosArticles();
    pixabayApiService.plusHitsLength(hits.length);
    appendHitsMarkup(hits);
    autoScroll();
    if (pixabayApiService.sumHitsLength === pixabayApiService.totalHits) {
      loadMoreBtnDisplay('none');

      return Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    console.log('catch сработал');
    console.error(error);
  }
  // pixabayApiService.axiosArticles().then(hits => {
  // pixabayApiService.plusHitsLength(hits.length);
  // appendHitsMarkup(hits);
  // autoScroll();
  // if (pixabayApiService.sumHitsLength === pixabayApiService.totalHits) {
  //   loadMoreBtnDisplay('none');

  //   return Notify.warning(
  //     "We're sorry, but you've reached the end of search results."
  //   );
  // }
  // });
}

function appendHitsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
  gallery.refresh();
}

function clearHitsMarkup() {
  refs.gallery.innerHTML = '';
}

function loadMoreBtnDisplay(display) {
  refs.loadMoreBtn.style.display = `${display}`;
}

function autoScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
