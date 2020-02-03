import moment from 'moment';
import AbstractComponent from './abstract-component.js';
import {calculateRunTime} from '../utils/common.js';

const generateFilmCardDescription = (description) => description.length > 140 ? `${description.slice(0, 139)}...` : description;

const generateActiveFilmCardControl = (type) => type ? ` film-card__controls-item--active` : ``;

const createFilmCardTemplate = (data) => {
  const {title, poster, totalRating, releaseDate, runtime, genre, description, comments, isWatchlist, isWatched, isFavorite} = data;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${moment(releaseDate).format(`YYYY`)}</span>
        <span class="film-card__duration">${calculateRunTime(runtime)}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${generateFilmCardDescription(description)}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${generateActiveFilmCardControl(isWatchlist)}"> Add to watchlist </button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched${generateActiveFilmCardControl(isWatched)}"> Mark as watched </button>
        <button class="film-card__controls-item button film-card__controls-item--favorite${generateActiveFilmCardControl(isFavorite)}"> Mark as favorite </button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createFilmCardTemplate(this._data);
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  setWatchListButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}

