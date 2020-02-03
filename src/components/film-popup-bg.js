import AbstractComponent from './abstract-component.js';

const createFilmPopupBgTemplate = () => `<section class="film-details"></section>`;

export default class FilmList extends AbstractComponent {
  getTemplate() {
    return createFilmPopupBgTemplate();
  }
}
