import ChartDataLabels from 'chartjs-plugin-datalabels';

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

const ChartParameter = {
  TYPE: `horizontalBar`,
  BAR_COLOR: `#ffe800`,
  BAR_WIDTH: 0.6,
  TEXT_COLOR: `#ffffff`,
  TEXT_SIZE: 17,
  LABEL_PADDING: 80,
  DATA_LABEL_OFFSET: 40,
  HEIGHT: 50
};

const MINUTES_IN_HOUR = 60;

const CHART_PROPERTIES = {
  plugins: [ChartDataLabels],
  type: ChartParameter.TYPE,
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
};

export {InputValue, LabelName, DAYS_COUNT, ChartParameter, MINUTES_IN_HOUR, CHART_PROPERTIES};
