import AbstractComponent from './abstract-component.js';

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

export default class FilmList extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createFilmListTemplate(this._data);
  }
}
