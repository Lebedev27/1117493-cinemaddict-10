import {getRandomBetween} from '../util.js';

const userRanks = [``, `Novice`, `Fan`, `Movie Buff`];

const generateUserRankIndex = (max) => Math.ceil(getRandomBetween(0, max) / 10);

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

export {createProfileStatusTemplate};
