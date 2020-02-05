import AbstractComponent from './abstract-component.js';

const USER_RANKS = [``, `Novice`, `Fan`, `Movie Buff`];
const DEVIDER = 10;

const generateUserRankIndex = (max) => Math.ceil(max / DEVIDER);

const getUserRank = (max) => USER_RANKS[generateUserRankIndex(max)];

const createProfileStatusTemplate = (watchedFilmsQuantity) => {
  const userRank = getUserRank(watchedFilmsQuantity);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class ProfileStatus extends AbstractComponent {
  constructor(movieModel) {
    super();
    this._movieModel = movieModel;
    this._watchedFilms = this._movieModel.getHistoryMovies();
  }

  getTemplate() {
    return createProfileStatusTemplate(this._watchedFilms.length);
  }
}
