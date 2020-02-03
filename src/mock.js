import moment from 'moment';
import {NAMES} from './constants.js';
import {getRandomBetween, getRandomArrayItem, sortingFilms} from './utils/common.js';

const SENTENCE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const FILMS = [`The Shawshank Redemption`, `The Godfather`, `The Dark Knight`, `Schindler's List`, `The Lord of the Rings: The Return of the King`, `Pulp Fiction`, `Fight Club`, `Forrest Gump`, `Inception`, `Matrix`, `Goodfellas`, `Se7en`, `Star Wars`, `Sen to Chihiro no kamikakushi`, `Interstellar`];
const IMAGES = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const COUNTRYES = [`Afghanistan`, `Albania`, `Algeria`, `Andorra`, `Angola`, `Argentina`, `Armenia`, `Australia`, `Austria`, `Azerbaijan`, `Bahrain`, `Bangladesh`];
const GENRES = [`Action`, `Adventure`, `Comedy`, `Drama`, `Crime`, `Horror`, `Fantasy`, `Western`, `Thriller`, `Animation`];
const emojiType = [`smile`, `sleeping`, `puke`, `angry`];
let id = 0;

const sentencesArray = SENTENCE.split(`.`);

const Confines = function (min, max) {
  this.min = min;
  this.max = max;
};

const Rating = new Confines(1, 9);
const Year = new Confines(1900, 2019);
const Months = new Confines(1, 12);
const Day = new Confines(1, 30);
const Hour = new Confines(0, 3);
const Minutes = new Confines(0, 59);
const SentencesQuantity = new Confines(1, 3);

const getRandomRating = (min, max) => {
  return Math.round(Math.random() * (max - min) + min) + Number(Math.random().toFixed(1));
};

const generateDescription = (quantity) => {
  let description = [];
  for (let i = 0; i < quantity; i++) {
    description.push(getRandomArrayItem(sentencesArray));
  }
  description = description.join(`. `);
  return description;
};

const generateComments = (count) => {
  const comments = [];
  for (let i = 0; i < count; i++) {
    const day = getRandomBetween(Day.min, Day.max);
    comments.push({
      emoji: getRandomArrayItem(emojiType),
      comment: generateDescription(getRandomBetween(SentencesQuantity.min, SentencesQuantity.max)),
      author: `${getRandomArrayItem(NAMES)} ${getRandomArrayItem(NAMES)}`,
      date: moment(`2019-12-${day} ${getRandomBetween(Hour.min, Hour.max)}:${getRandomBetween(Minutes.min, Minutes.max)}`).toDate()
    });
  }
  return sortingFilms(comments, `date`, `reverse`);
};

const generateFilmCardData = () => {
  id += 1;
  const isItWatched = Math.random() > 0.5;
  const filmDescription = generateDescription(getRandomBetween(SentencesQuantity.min, SentencesQuantity.max));
  const date = `${getRandomBetween(Year.min, Year.max)}-${getRandomBetween(Months.min, Months.max)}-${getRandomBetween(Day.min, Day.max)} ${getRandomBetween(Hour.min, Hour.max)}:${getRandomBetween(Minutes.min, Minutes.max)}`;
  return {
    id,
    title: getRandomArrayItem(FILMS),
    image: getRandomArrayItem(IMAGES),
    rating: getRandomRating(Rating.min, Rating.max),
    time: date,
    genre: [getRandomArrayItem(GENRES), getRandomArrayItem(GENRES), getRandomArrayItem(GENRES)],
    description: filmDescription,
    comments: generateComments(getRandomRating(Rating.min, Rating.max)),
    director: getRandomArrayItem(NAMES),
    writers: `${getRandomArrayItem(NAMES)}, ${getRandomArrayItem(NAMES)}, ${getRandomArrayItem(NAMES)}`,
    actors: `${getRandomArrayItem(NAMES)}, ${getRandomArrayItem(NAMES)}, ${getRandomArrayItem(NAMES)}`,
    releaseDate: moment(date).toDate(),
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

export {generateFilmCardsData, NAMES};
