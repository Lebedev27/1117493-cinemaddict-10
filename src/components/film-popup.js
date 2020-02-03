import AbstractComponent from './abstract-component.js';

const generateFilmsDetailsRow = (obj) => {
  let fragment = document.createDocumentFragment();
  const arr = [];
  for (const item of Object.keys(obj)) {
    arr.push(
        `<tr class="film-details__row">
          <td class="film-details__term">${item}</td>
          <td class="film-details__cell">${obj[item]}</td>
        </tr>`);
  }
  fragment = arr.join(`\n`);
  return fragment;
};

const generateFilmDetailsControls = (obj) => {
  let fragment = document.createDocumentFragment();
  const arr = [];
  for (const item of Object.keys(obj)) {
    arr.push(
        `<input type="checkbox" class="film-details__control-input visually-hidden" id="${item}" name="${item}">
        <label for="${item}" class="film-details__control-label film-details__control-label--${item}">${obj[item]}</label>`);
  }
  fragment = arr.join(`\n`);
  return fragment;
};

const createFilmPopupTemplate = (data) => {
  const {title, image, rating, time, genre, description, comments, director, writers, actors, releaseDate, country} = data;

  const FilmsDetailsRow = {
    'Director': director,
    'Writers': writers,
    'Actors': actors,
    'Release Date': releaseDate,
    'Runtime': time,
    'Country': country
  };

  const filmDetailsControls = {
    watchlist: `Add to watchlist`,
    watched: `Already watched`,
    favorite: `Add to favorites`
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
                </div>
              </div>

              <table class="film-details__table">
                ${generateFilmsDetailsRow(FilmsDetailsRow)}
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    <span class="film-details__genre">${genre[0]}</span>
                    <span class="film-details__genre">${genre[1]}</span>
                    <span class="film-details__genre">${genre[2]}</span></td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${generateFilmDetailsControls(filmDetailsControls)}
          </section>
        </div>

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

export default class FilmPopup extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createFilmPopupTemplate(this._data);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
  }

  removeClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, handler);
  }
}
