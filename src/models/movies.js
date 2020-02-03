import {getFilmsByFilter} from '../utils/filter.js';
import {FilterName, GenreIndex} from '../constants.js';

export default class Movies {
  constructor() {
    this._movies = [];
    this._activeFilterName = FilterName.ALL;
    this._allWatchedMovies = null;
    this._watchedMovies = null;
    this.genresData = null;
    this.sortedGenresData = null;
    this.topGenre = null;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getMovies() {
    return getFilmsByFilter(this._movies, this._activeFilterName);
  }

  getHistoryMovies() {
    this._allWatchedMovies = getFilmsByFilter(this._movies, FilterName.HISTORY);
    return this._allWatchedMovies;
  }

  getMoviesAll() {
    return this._movies;
  }

  getWatchedSortedGenres() {
    this.sortedGenresData = [...this.getGenresData()].sort((a, b) => b[GenreIndex.VALUE] - a[GenreIndex.VALUE]);
    return this.sortedGenresData;
  }

  getWatchedSortedGenresForChart() {
    return new Map(this.getWatchedSortedGenres());
  }

  getTopGenre() {
    const sortedGenresData = this.getWatchedSortedGenres();
    this.topGenre = sortedGenresData.length !== 0 ? sortedGenresData[GenreIndex.TOP_GENRE][GenreIndex.NAME] : sortedGenresData.length;
    return this.topGenre;
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
  }

  setWatchedMovies(movies) {
    this._watchedMovies = Array.from(movies);
  }

  setFilter(filterName) {
    this._activeFilterName = filterName;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updateMovie(id, movie) {
    const index = this._movies.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), movie, this._movies.slice(index + 1));
    this._dataChangeHandlers.forEach((handler) => handler());

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  countUniqueData(newData, type) {
    type.forEach((it) => {
      if (newData.has(it)) {
        const value = newData.get(it);
        newData.set(it, value + 1);
      } else {
        newData.set(it, 1);
      }
    });
  }

  getGenresData() {
    this.genresData = new Map();
    const genres = this._watchedMovies.map((film) => film.genre).flat();
    this.countUniqueData(this.genresData, genres);
    return this.genresData;
  }
}
