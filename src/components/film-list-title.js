import AbstractComponent from './abstract-component.js';

const generateFilmListTitle = (data) => data.length === 0 ?
  `<h2 class="films-list__title">There are no movies in our database</h2>` :
  `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`;

export default class FilmListTitle extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return generateFilmListTitle(this._data);
  }
}
