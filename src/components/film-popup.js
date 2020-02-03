import moment from 'moment';
import AbstractSmartComponent from './abstract-smart-component.js';
import {remove} from '../utils/render.js';
import {pluralize} from '../utils/common.js';

const popupRatingLength = 9;

const generateFilmsDetailsRow = (filmsDetailsRow) => {
  return Object.entries(filmsDetailsRow).map(([key, name]) => {
    return `
      <tr class="film-details__row">
        <td class="film-details__term">${key}</td>
        <td class="film-details__cell">${name}</td>
      </tr>
    `;
  }).join(`\n`);
};

const generateFilmDetailsControls = (filmDetailsControls) => {
  return Object.entries(filmDetailsControls).map(([key, name]) => {
    const loweKey = key.toLowerCase();
    return `
    <input type="checkbox" class="film-details__control-input visually-hidden" id="${loweKey}" name="${loweKey}"${name[1] ? ` checked` : ``}>
    <label for="${loweKey}" class="film-details__control-label film-details__control-label--${loweKey}">${name[0]}</label>
    `;
  }).join(`\n`);
};

const generateRating = (userRating) => {
  const userRatingMenu = [];
  for (let i = 0; i < popupRatingLength; i++) {
    const index = i + 1;
    userRatingMenu.push(
        `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${index}" id="rating-${index}"${Number(userRating) === (index) ? ` checked` : ``}>
         <label class="film-details__user-rating-label" for="rating-${index}">${index}</label>`
    );
  }
  return userRatingMenu.join(`\n`);
};

const generateSelfFilmRating = (isWatched, title, image, userRating) => {
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
  return genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join(`\n`);
};

const generateUserRatingLabel = (isWatched, userRating) => {
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
    'Release Date': moment(releaseDate).format(`D MMMM YYYY`),
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
                  ${generateUserRatingLabel(isWatched, userRating)}
                </div>
              </div>

              <table class="film-details__table">
                ${generateFilmsDetailsRow(FilmsDetailsRow)}
                <tr class="film-details__row">
                  <td class="film-details__term">${pluralize(genre.length, `Genre`)}</td>
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

        ${generateSelfFilmRating(isWatched, title, image, userRating)}

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
    this.recoverListeners = this.recoverListeners.bind(this);
    this._subscribeOnEvents = this._subscribeOnEvents.bind(this);
    this._handler = this._handler.bind(this);
    this.watchlistControlClickHandler = this.watchlistControlClickHandler.bind(this);
    this.favoriteControlClickHandler = this.favoriteControlClickHandler.bind(this);
    this.watchedControlClickHandler = this.watchedControlClickHandler.bind(this);
    this.userRatingScoreClickHandler = this.userRatingScoreClickHandler.bind(this);

  }

  getTemplate() {
    return createFilmPopupTemplate(this._data);
  }

  recoverListeners() {
    this._subscribeOnEvents();
  }

  _handler() {
    if (this.getElement()) {
      this.getElement().querySelector(`.film-details__close-btn`)
        .removeEventListener(`click`, this._handler);
      document.removeEventListener(`keydown`, this._handler);
      remove(this);
    }
  }

  watchlistControlClickHandler() {
    this._data.isWatchList = !this._data.isWatchList;
    this.rerender();
  }

  favoriteControlClickHandler() {
    this._data.isFavorite = !this._data.isFavorite;
    this.rerender();
  }

  watchedControlClickHandler() {
    this._data.isWatched = !this._data.isWatched;
    this._data.userRating = `0`;
    this.rerender();
  }

  userRatingScoreClickHandler(evt) {
    if (evt.target.tagName === `LABEL`) {
      this._data.userRating = evt.target.textContent;
      this.rerender();
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, this.watchlistControlClickHandler);

    element.querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, this.watchedControlClickHandler);

    if (element.querySelector(`.film-details__user-rating-score`)) {
      element.querySelector(`.film-details__user-rating-score`)
        .addEventListener(`click`, this.userRatingScoreClickHandler);
    }

    element.querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, this.favoriteControlClickHandler);

    element.querySelector(`.film-details__close-btn`)
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
