import {createElement} from '../util.js';

const generateFilmListContainer = (data) => data.length > 0 ? `<div class="films-list__container"></div>` : ``;

const createFilmListTemplate = (data) => {
  return (
    `<section class="films">
      <section class="films-list">

        ${generateFilmListContainer(data)}
      </section>
    </section>`
  );
};

export default class FilmList {
  constructor(data) {
    this._data = data;
    this._element = null;
  }

  getTemplate() {
    return createFilmListTemplate(this._data);
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
