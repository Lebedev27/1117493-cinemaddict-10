import {SortFlag} from '../constants.js';

const getRandomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomBetween(0, array.length);

  return array[randomIndex];
};

const sortFilms = (data, type, flag) => {
  const newData = data.slice();
  if (flag === SortFlag.REVERSE) {
    newData.sort((a, b) => a[type] - b[type]);
  } else if (flag === SortFlag.LENGTH) {
    newData.sort((a, b) => b[type].length - a[type].length);
  } else {
    newData.sort((a, b) => b[type] - a[type]);
  }
  return newData;
};

const pluralize = (count, noun, suffix = `s`) =>
  `${noun}${count !== 1 ? suffix : ``}`;

const bindAll = (ctx, props) => {
  props.forEach((prop) => {
    ctx[prop] = ctx[prop].bind(ctx);
  });
};

const calculateRunTime = (time) => `${Math.floor(time / 60)}h ${time % 60}m`;

const mapEntries = (obj, cb) => Object.entries(obj).map(cb);

export {calculateRunTime, getRandomBetween, getRandomArrayItem, sortFilms, pluralize, bindAll, mapEntries};
