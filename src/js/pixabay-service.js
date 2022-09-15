import axios from 'axios';

const API_KAY = '29248812-56480c4f477581b48a8b2d913';
const BASE_URL = 'https://pixabay.com/api/';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = '';
  }

  axiosArticles() {
    const queryParams = {
      key: API_KAY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 5,
    };

    return axios
      .get(BASE_URL, {
        params: queryParams,
      })
      .then(({ data }) => {
        this.incrementPage();
        return data.hits;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
