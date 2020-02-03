import AbstractComponent from './abstract-component.js';

const generateFilmCardDescription = (description) => description.length > 140 ? `${description.slice(0, 139)}...` : description;

const createFilmCardTemplate = (data) => {
  const {title, image, rating, year, time, genre, description, comments} = data;
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
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
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
}

