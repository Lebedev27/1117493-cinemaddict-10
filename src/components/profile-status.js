import {getRandomBetween, createElement} from '../util.js';

const userRanks = [``, `Novice`, `Fan`, `Movie Buff`];
const devider = 10;

const generateUserRankIndex = (max) => Math.ceil(getRandomBetween(0, max) / devider);

const getUserRank = (max) => userRanks[generateUserRankIndex(max)];

const createProfileStatusTemplate = (max) => {
  const userRank = getUserRank(max);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class ProfileStatus {
  constructor(max) {
    this._max = max;
    this._element = null;
  }

  getTemplate() {
    return createProfileStatusTemplate(this._max);
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
