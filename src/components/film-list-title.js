import {createElement} from '../util.js';

const generateFilmListTitle = (data) => data.length === 0 ? `<h2 class="films-list__title">There are no movies in our database</h2>` : `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`;

export default class FilmListTitle {
  constructor(data) {
    this._data = data;
    this._element = null;
  }

  getTemplate() {
    return generateFilmListTitle(this._data);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
