const getRandomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomBetween(0, array.length);

  return array[randomIndex];
};

const sortingFilms = (data, type, reverse) => {
  const newData = data.slice();
  if (reverse) {
    newData.sort((a, b) => {
      return a[type] - b[type];
    });
  } else {
    newData.sort((a, b) => {
      return b[type] - a[type];
    });
  }
  return newData;
};

const pluralize = (count, noun, suffix = `s`) =>
  `${noun}${count !== 1 ? suffix : ``}`;

export {getRandomBetween, getRandomArrayItem, sortingFilms, pluralize};
