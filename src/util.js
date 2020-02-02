const getRandomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomBetween(0, array.length);

  return array[randomIndex];
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export {getRandomBetween, getRandomArrayItem, createElement};
