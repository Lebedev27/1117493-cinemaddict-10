import AbstractComponent from './abstract-component.js';

const generateFilmCardDescription = (description) => description.length > 140 ? `${description.slice(0, 139)}...` : description;

const generateActiveFilmCardControl = (type) => type ? ` film-card__controls-item--active` : ``;

const createFilmCardTemplate = (data) => {
  const {title, image, rating, year, time, genre, description, comments, isWatchList, isWatched, isFavorite} = data;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${time}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="./images/posters/${image}" alt="" class="film-card__poster">
      <p class="film-card__description">${generateFilmCardDescription(description)}</p>
      <a class="film-card__comments">${comments} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${generateActiveFilmCardControl(isWatchList)}"> Add to watchlist </button>
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

    this.setClickHandler = this.setClickHandler.bind(this);
    // this.setWatchListButtonClickHandler = this.setWatchListButtonClickHandler.bind(this);
    // this.setWatchedButtonClickHandler = this.setWatchedButtonClickHandler.bind(this);
    // this.setFavoritesButtonClickHandler = this.setFavoritesButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._data);
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  // setWatchListButtonClickHandler(handler) {
  //   this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
  //     .addEventListener(`click`, handler);
  // }

  // setWatchedButtonClickHandler(handler) {
  //   this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
  //     .addEventListener(`click`, handler);
  // }

  // setFavoritesButtonClickHandler(handler) {
  //   this.getElement().querySelector(`.film-card__controls-item--favorite`)
  //     .addEventListener(`click`, handler);
  // }
}

