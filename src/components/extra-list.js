import AbstractComponent from './abstract-component.js';

const createExtraListMarkup = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};

export default class ExtraList extends AbstractComponent {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return createExtraListMarkup(this._title);
  }
}
