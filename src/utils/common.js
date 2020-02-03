const getRandomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomBetween(0, array.length);

  return array[randomIndex];
};

const sortFilms = (data, type, flag) => {
  const newData = data.slice();
  if (flag === `reverse`) {
    newData.sort((a, b) => a[type] - b[type]);
  } else if (flag === `length`) {
    newData.sort((a, b) => b[type].length - a[type].length);
  } else {
    newData.sort((a, b) => b[type] - a[type]);
  }
  return newData;
};

const getRandomDate = () => {
  const targetDate = new Date();
  const diffValue = -getRandomBetween(0, 60);

  targetDate.setDate(targetDate.getDate() + diffValue);
  return targetDate;
};

const pluralize = (count, noun, suffix = `s`) =>
  `${noun}${count !== 1 ? suffix : ``}`;

const bindAll = (ctx, props) => {
  props.forEach((prop) => {
    ctx[prop] = ctx[prop].bind(ctx);
  });
};

const calculateRunTime = (time) => `${Math.floor(time / 60)}h ${time % 60}m`;

export {getRandomDate, calculateRunTime, getRandomBetween, getRandomArrayItem, sortFilms, pluralize, bindAll};
