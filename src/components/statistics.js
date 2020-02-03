import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const InputValue = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const LabelName = {
  [InputValue.ALL_TIME]: `All time`,
  [InputValue.TODAY]: `Today`,
  [InputValue.WEEK]: `Week`,
  [InputValue.MONTH]: `Month`,
  [InputValue.YEAR]: `Year`
};

const DAYS_COUNT = {
  TODAY: 1,
  WEEK: 7,
  MONTH: 30,
  YEAR: 365
};

const TimeIndex = {
  HOUR: 0,
  MINUTE: 1
};

const ChartParameter = {
  TYPE: `horizontalBar`,
  BAR_COLOR: `#ffe800`,
  BAR_WIDTH: 0.6,
  TEXT_COLOR: `#ffffff`,
  TEXT_SIZE: 17,
  LABEL_PADDING: 80,
  DATA_LABEL_OFFSET: 40
};

const MINUTES_IN_HOUR = 60;

const getTotalDuration = (films) => {
  const totalWatchedTime = films.map((film) => moment(film.time).format(`h:mm`).split(`:`));
  const hours = totalWatchedTime.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue[TimeIndex.HOUR]);
  }, 0);
  const minutes = totalWatchedTime.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue[TimeIndex.MINUTE]);
  }, 0);
  const totalHours = hours + Math.round(minutes / MINUTES_IN_HOUR);
  const totalMinutes = minutes % MINUTES_IN_HOUR;
  return `${totalHours} <span class="statistic__item-description">h</span> ${totalMinutes} <span class="statistic__item-description">m</span>`;
};

const geFilteredFilmsByDate = (films, days) => {
  if (days) {
    const dateNow = new Date();
    const dateFrom = (() => {
      const date = new Date(dateNow);
      date.setDate(date.getDate() - days);
      return date;
    })();
    return films.filter((film) => {
      return film.isWatched >= dateFrom;
    });
  }
  return films;
};

const renderNewChart = (ctx, labelNames, chartData) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: ChartParameter.TYPE,
    data: {
      labels: labelNames,
      datasets: [{
        data: chartData,
        backgroundColor: ChartParameter.BAR_COLOR,
        categoryPercentage: ChartParameter.BAR_WIDTH
      }]
    },
    options: {
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            beginAtZero: true
          }
        }],
        yAxes: [{
          ticks: {
            padding: ChartParameter.LABEL_PADDING,
            fontColor: ChartParameter.TEXT_COLOR,
            fontSize: ChartParameter.TEXT_SIZE
          }
        }]
      },
      plugins: {
        datalabels: {
          color: ChartParameter.TEXT_COLOR,
          font: {
            size: ChartParameter.TEXT_SIZE
          },
          anchor: `start`,
          align: `left`,
          offset: ChartParameter.DATA_LABEL_OFFSET,
        }
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const renderChart = (ctx, sortedGenresData) => {
  const genresLabels = [...sortedGenresData.keys()];
  const genresValues = [...sortedGenresData.values()];

  ctx.height = 50 * genresLabels.length;

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
    if (evt.target.tagName === `INPUT`) {
      this._target = evt.target.value;
      const filteredFilmsByDate = geFilteredFilmsByDate(this._filmsData.getHistoryMovies(), DAYS_COUNT[(evt.target.value).toUpperCase()]);
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
