import {createElement} from '../util.js';

// const EXTRA_TITLES = [`Top rated`, `Most commented`];

const createExtraListMarkup = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};

const createExtraListTemplate = (title) => {
  return createExtraListMarkup(title);
};

export default class ExtraList {
  constructor(title) {
    this._title = title;
    this._element = null;
  }

  getTemplate() {
    return createExtraListTemplate(this._title);
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
