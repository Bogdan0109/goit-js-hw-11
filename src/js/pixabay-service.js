import axios from 'axios';

const API_KAY = '29248812-56480c4f477581b48a8b2d913';
const BASE_URL = 'https://pixabay.com/api/';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = '';
    this.sumHitsLength = 0;
  }

  axiosArticles() {
    const queryParams = {
      key: API_KAY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 10,
    };

    return axios
      .get(BASE_URL, {
        params: queryParams,
      })
      .then(({ data }) => {
        this.newHits(data.totalHits);
        this.incrementPage();
        return data.hits;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  plusHitsLength(hitsLength) {
    this.sumHitsLength += hitsLength;
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

  newHits(newHits) {
    this.totalHits = newHits;
  }
}
