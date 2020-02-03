import {FilterName} from '../constants.js';

const getWatchlistFilms = (films) => {
  return films.filter((film) => film.isWatchList);
};

const getWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

const getFavoriteFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};

const getFilmsByFilter = (films, filterName) => {
  switch (filterName) {
    case FilterName.WATCHLIST:
      return getWatchlistFilms(films);
    case FilterName.HISTORY:
      return getWatchedFilms(films);
    case FilterName.FAVORITES:
      return getFavoriteFilms(films);
  }
  return films;
};

export {getFilmsByFilter};
