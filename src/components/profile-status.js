import AbstractComponent from './abstract-component.js';
import {getRandomBetween} from '../utils/common.js';

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

export default class ProfileStatus extends AbstractComponent {
  constructor(max) {
    super();
    this._max = max;
  }

  getTemplate() {
    return createProfileStatusTemplate(this._max);
  }
}
