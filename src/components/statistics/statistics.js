import Chart from 'chart.js';
import AbstractSmartComponent from '../abstract-smart-component.js';
import {TagName} from '../../constants.js';
import {InputValue, LabelName, DAYS_COUNT, ChartParameter, MINUTES_IN_HOUR, CHART_PROPERTIES} from './statistics-constants.js';

const getTotalDurationTime = (films) => {
  const totalWatchedTime = films.map((film) => film.runtime).reduce((totalTime, runtime) => totalTime + runtime);

  const totalHours = Math.floor(totalWatchedTime / MINUTES_IN_HOUR);
  const totalMinutes = totalWatchedTime % MINUTES_IN_HOUR;
  return {totalHours, totalMinutes};
};

const getTotalDuration = (films) => {
  const {totalHours, totalMinutes} = getTotalDurationTime(films);

  return `${totalHours} <span class="statistic__item-description">h</span> ${totalMinutes} <span class="statistic__item-description">m</span>`;
};

const getFilteredFilmsByDate = (films, days) => {
  if (days) {
    const dateNow = new Date();
    const dateFrom = (() => {
      const date = new Date(dateNow);
      date.setDate(date.getDate() - days);
      return date;
    })();
    return films.filter((film) => {
      return film.watchingDate >= dateFrom;
    });
  }
  return films;
};

const renderNewChart = (ctx, labelNames, chartData) => {
  return new Chart(ctx, Object.assign({}, CHART_PROPERTIES, {data: {
    labels: labelNames,
    datasets: [{
      data: chartData,
      backgroundColor: ChartParameter.BAR_COLOR,
      categoryPercentage: ChartParameter.BAR_WIDTH
    }]
  }})
  );
};

const renderChart = (ctx, sortedGenresData) => {
  const genresLabels = [...sortedGenresData.keys()];
  const genresValues = [...sortedGenresData.values()];

  ctx.height = ChartParameter.HEIGHT * genresLabels.length;

  return renderNewChart(ctx, genresLabels, genresValues);
};

const generateLabels = (target) => {
  return Object.entries(LabelName).map(([key, name]) => {
    return `
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${key}" value="${key}"${target === key ? `checked` : ``}>
      <label for="statistic-${key}" class="statistic__filters-label">${name}</label>
    `;
  }).join(`\n`);
};

const createStatisticsTemplate = (watchedFilms, totalDuration, topGenre, target) => {
  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${topGenre}ghter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        ${generateLabels(target)}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilms.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDuration}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(filmsData) {
    super();

    this._filmsData = filmsData;
    this.watchedFilms = this._filmsData.getHistoryMovies();

    this._target = InputValue.ALL_TIME;
    this.genresData = null;
    this.sortedGenresData = null;
    this.totalDuration = null;
    this.topGenre = null;

    this._chart = null;

    this.handler = this.handler.bind(this);
  }

  getTemplate() {
    this._filmsData.setWatchedMovies(this.watchedFilms);
    this.totalDuration = getTotalDuration(this.watchedFilms);

    return createStatisticsTemplate(this.watchedFilms, this.totalDuration, this._filmsData.getTopGenre(), this._target);
  }

  show() {
    super.show();
    this.watchedFilms = this._filmsData.getHistoryMovies();
    this.rerender(this.watchedFilms);
  }

  hide() {
    super.hide();
    this._target = InputValue.ALL_TIME;
    this.getElement().querySelector(`.statistic__filters`)
      .removeEventListener(`change`, this.handler);
  }

  clearElement() {
    super.clearElement();

    this.getElement().querySelector(`.statistic__filters`)
      .removeEventListener(`change`, this.handler);
  }

  rerender(filmsData) {
    this.watchedFilms = filmsData;

    super.rerender();

    this._renderChart();
  }

  handler(evt) {
    if (evt.target.tagName === TagName.INPUT) {
      this._target = evt.target.value;

      const filteredFilmsByDate = getFilteredFilmsByDate(this._filmsData.getHistoryMovies(), DAYS_COUNT[(evt.target.value).toUpperCase()]);

      this.rerender(filteredFilmsByDate);
    }
  }

  recoverListeners() {}

  _renderChart() {
    const ctx = this.getElement().querySelector(`.statistic__chart`);
    this._resetChart();
    this._chart = renderChart(ctx, this._filmsData.getWatchedSortedGenresForChart());

    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, this.handler);
  }

  _resetChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }
}
