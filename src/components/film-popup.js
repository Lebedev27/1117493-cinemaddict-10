import AbstractSmartComponent from './abstract-smart-component.js';
import {remove} from '../utils/render.js';


const popupRatingLength = 9;

const generateFilmsDetailsRow = (filmsDetailsRow) => {
  const filmsDetailsRows = [];
  for (const item of Object.keys(filmsDetailsRow)) {
    filmsDetailsRows.push(
        `<tr class="film-details__row">
          <td class="film-details__term">${item}</td>
          <td class="film-details__cell">${filmsDetailsRow[item]}</td>
        </tr>`);
  }
  return filmsDetailsRows.join(`\n`);
};

const generateFilmDetailsControls = (filmDetailsControls) => {
  const buttons = [];
  for (const item of Object.keys(filmDetailsControls)) {
    buttons.push(
        `<input type="checkbox" class="film-details__control-input visually-hidden" id="${item.toLowerCase()}" name="${item.toLowerCase()}"${filmDetailsControls[item][1] ? ` checked` : ``}>
        <label for="${item.toLowerCase()}" class="film-details__control-label film-details__control-label--${item.toLowerCase()}">${filmDetailsControls[item][0]}</label>`);
  }
  return buttons.join(`\n`);
};

const generateRating = (userRating) => {
  const userRatingMenu = [];
  for (let i = 0; i < popupRatingLength; i++) {
    userRatingMenu.push(
        `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i + 1}" id="rating-${i + 1}"${Number(userRating) === (i + 1) ? ` checked` : ``}>
          <label class="film-details__user-rating-label" for="rating-${i + 1}">${i + 1}</label>`
    );
  }
  return userRatingMenu.join(`\n`);
};

const generateYourSelfFilmRating = (isWatched, title, image, userRating) => {
  return (
    isWatched ?
      `<div class="form-details__middle-container">
        <section class="film-details__user-rating-wrap">
          <div class="film-details__user-rating-controls">
            <button class="film-details__watched-reset" type="button">Undo</button>
          </div>

          <div class="film-details__user-score">
            <div class="film-details__user-rating-poster">
              <img src="./images/posters/${image}" alt="film-poster" class="film-details__user-rating-img">
            </div>

            <section class="film-details__user-rating-inner">
              <h3 class="film-details__user-rating-title">${title}</h3>

              <p class="film-details__user-rating-feelings">How you feel it?</p>

              <div class="film-details__user-rating-score">
                ${generateRating(userRating)}
              </div>
            </section>
          </div>
        </section>
      </div>` : ``
  );
};

const generateGenres = (genres) => {
  const genresList = [];
  for (const genre of genres) {
    genresList.push(
        `<span class="film-details__genre">${genre}</span>`
    );
  }
  return genresList.join(`\n`);
};

const generateYserRatingLabel = (isWatched, userRating) => {
  if (isWatched && userRating > 0) {
    return `<p class="film-details__user-rating">Your rate ${userRating}</p>`;
  }
  return ``;
};

const createFilmPopupTemplate = (data) => {
  const {title, image, rating, time, genre, description, comments, director, writers, actors, releaseDate, country, isWatchList, isWatched, isFavorite, userRating} = data;

  const FilmsDetailsRow = {
    'Director': director,
    'Writers': writers,
    'Actors': actors,
    'Release Date': releaseDate,
    'Runtime': time,
    'Country': country
  };

  const FilmDetailsControls = {
    WATCHLIST: [`Add to watchlist`, isWatchList],
    WATCHED: [`Already watched`, isWatched],
    FAVORITE: [`Add to favorites`, isFavorite]
  };

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${image}" alt="">

              <p class="film-details__age">18+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                  ${generateYserRatingLabel(isWatched, userRating)}
                </div>
              </div>

              <table class="film-details__table">
                ${generateFilmsDetailsRow(FilmsDetailsRow)}
                <tr class="film-details__row">
                  <td class="film-details__term">${genre.length === 1 ? `Genre` : `Genres`}</td>
                  <td class="film-details__cell">
                    ${generateGenres(genre)}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${generateFilmDetailsControls(FilmDetailsControls)}
          </section>
        </div>

        ${generateYourSelfFilmRating(isWatched, title, image, userRating)}

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments}</span></h3>

            <ul class="film-details__comments-list"></ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                <img src="images/emoji/smile.png" width="55" height="55" alt="emoji">
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">Great movie!</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping" checked>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
                <label class="film-details__emoji-label" for="emoji-gpuke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmPopup extends AbstractSmartComponent {
  constructor(data) {
    super();
    this._data = data;

    this.setWatchListButtonClickHandler = this.setClickHandler.bind(this);
    this.setWatchedButtonClickHandler = this.setClickHandler.bind(this);
    this.setFavoritesButtonClickHandler = this.setClickHandler.bind(this);
    this.recoveryListeners = this.recoveryListeners.bind(this);
    this._subscribeOnEvents = this._subscribeOnEvents.bind(this);
    this._handler = this._handler.bind(this);
  }

  getTemplate() {
    return createFilmPopupTemplate(this._data);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  _handler() {
    if (this.getElement()) {
      remove(this);
      this.getElement().querySelector(`.film-details__close-btn`)
        .removeEventListener(`click`, this._handler);
      document.removeEventListener(`keydown`, this._handler);
    }
  }

  _subscribeOnEvents() {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, () => {
        this._data.isWatchList = !this._data.isWatchList;
        this.rerender();
      });

    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, () => {
        this._data.isWatched = !this._data.isWatched;
        this._data.userRating = `0`;
        this.rerender();
      });

    if (this.getElement().querySelector(`.film-details__user-rating-score`)) {
      this.getElement().querySelector(`.film-details__user-rating-score`)
        .addEventListener(`click`, (evt) => {
          if (evt.target.tagName === `LABEL`) {
            this._data.userRating = evt.target.textContent;
            this.rerender();
          }
        });
    }

    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, () => {
        this._data.isFavorite = !this._data.isFavorite;
        this.rerender();
      });

    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, this._handler);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, handler);
  }

  removeClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
    .removeEventListener(`click`, handler);
  }

  // setWatchListButtonClickHandler(handler) {
  //   this.getElement().querySelector(`.film-details__control-label--watchlist`)
  //     .addEventListener(`click`, handler);
  // }

  // setWatchedButtonClickHandler(handler) {
  //   this.getElement().querySelector(`.film-details__control-label--watched`)
  //     .addEventListener(`click`, handler);
  // }

  // setFavoritesButtonClickHandler(handler) {
  //   this.getElement().querySelector(`.film-details__control-label--favorite`)
  //     .addEventListener(`click`, handler);
  // }
}
