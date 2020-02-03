import {getRandomBetween, getRandomArrayItem} from './utils/common.js';

const FILTER_NAMES = [`All movies`, `Watchlist`, `History`, `Favorites`, `Stats`];
const SENTENCE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const FILMS = [`The Shawshank Redemption`, `The Godfather`, `The Dark Knight`, `Schindler's List`, `The Lord of the Rings: The Return of the King`, `Pulp Fiction`, `Fight Club`, `Forrest Gump`, `Inception`, `Matrix`, `Goodfellas`, `Se7en`, `Star Wars`, `Sen to Chihiro no kamikakushi`, `Interstellar`];
const IMAGES = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const MONTHS = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
const COUNTRYES = [`Afghanistan`, `Albania`, `Algeria`, `Andorra`, `Angola`, `Argentina`, `Armenia`, `Australia`, `Austria`, `Azerbaijan`, `Bahrain`, `Bangladesh`];
const NAMES = [`AARON`, `ADAM`, `AIDEN`, `ALBERT`, `ALEX`, `ALEXANDER`, `ALFIE`, `ARCHIE`, `ARTHUR`, `AUSTIN`, `BENJAMIN`, `BLAKE`, `BOBBY`];
const GENRES = [`Action`, `Adventure`, `Comedy`, `Drama`, `Crime`, `Horror`, `Fantasy`, `Western`, `Thriller`, `Animation`];
const FILTER_MAX_VALUE = 20;

const sentencesArray = SENTENCE.split(`.`);

const Confines = function (min, max) {
  this.min = min;
  this.max = max;
};

const Rating = new Confines(1, 9);
const Year = new Confines(1900, 2019);
const Day = new Confines(1, 30);
const Hour = new Confines(0, 3);
const Minutes = new Confines(0, 59);
const Comments = new Confines(0, 100);
const SentencesQuantity = new Confines(1, 3);

const getRandomRating = (min, max) => {
  return Math.round(Math.random() * (max - min) + min) + Number(Math.random().toFixed(1));
};

const generateExceptionsFiltersCount = (item) => {
  if (item.includes(FILTER_NAMES[0]) || item.includes(FILTER_NAMES[4])) {
    return ``;
  }
  return Math.floor(Math.random() * FILTER_MAX_VALUE);
};

const generateFilters = () => {
  return FILTER_NAMES.map((item) => {
    const generateLink = item.slice(0, item.includes(` `) ? item.indexOf(` `) : item.length).toLowerCase();
    return {
      name: item,
      link: generateLink,
      count: generateExceptionsFiltersCount(item)
    };
  });
};

const generateDescription = (quantity) => {
  let description = [];
  for (let i = 0; i < quantity; i++) {
    description.push(getRandomArrayItem(sentencesArray));
  }
  description = description.join(`. `);
  return description;
};

const generateFilmCardData = () => {
  const productionYear = getRandomBetween(Year.min, Year.max);
  const isItWatched = Math.random() > 0.5;
  const filmDescription = generateDescription(getRandomBetween(SentencesQuantity.min, SentencesQuantity.max));
  return {
    title: getRandomArrayItem(FILMS),
    image: getRandomArrayItem(IMAGES),
    rating: getRandomRating(Rating.min, Rating.max),
    year: productionYear,
    time: `${getRandomBetween(Hour.min, Hour.max)}h ${getRandomBetween(Minutes.min, Minutes.max)}m`,
    genre: [getRandomArrayItem(GENRES), getRandomArrayItem(GENRES), getRandomArrayItem(GENRES)],
    description: filmDescription,
    comments: getRandomBetween(Comments.min, Comments.max),
    director: getRandomArrayItem(NAMES),
    writers: `${getRandomArrayItem(NAMES)}, ${getRandomArrayItem(NAMES)}, ${getRandomArrayItem(NAMES)}`,
    actors: `${getRandomArrayItem(NAMES)}, ${getRandomArrayItem(NAMES)}, ${getRandomArrayItem(NAMES)}`,
    releaseDate: `${getRandomBetween(Day.min, Day.max)} ${getRandomArrayItem(MONTHS)} ${productionYear}`,
    country: getRandomArrayItem(COUNTRYES),
    isWatchList: Math.random() > 0.5,
    isWatched: isItWatched,
    isFavorite: Math.random() > 0.5,
    userRating: isItWatched ? Math.floor(getRandomRating(Rating.min, Rating.max)) : null
  };
};

const generateFilmCardsData = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilmCardData);
};

export {generateFilters, generateFilmCardsData};
