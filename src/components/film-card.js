import {createElement} from '../util.js';

const createFilmCardTemplate = (data, i) => {
  const {title, image, rating, year, time, genre, description, comments} = data;
  return (
    `<article class="film-card" data-id=${i}>
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${time}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="./images/posters/${image}" alt="" class="film-card__poster">
      <p class="film-card__description">${description.length > 140 ? `${description.slice(0, 139)}...` : description}</p>
      <a class="film-card__comments">${comments} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard {
  constructor(data, i) {
    this._data = data;
    this._index = i;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._data, this._index);
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

