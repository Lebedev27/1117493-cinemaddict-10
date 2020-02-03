import FilterComponent from '../components/filter.js';
import {FilterName} from '../constants.js';
import {renderHtmlPart, RenderPosition, replace} from '../utils/render.js';
import {getFilmsByFilter} from '../utils/filter.js';

export default class FilterController {
  constructor(container, movieModel) {
    this._container = container;
    this._movieModel = movieModel;

    this._activeFilterName = FilterName.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._movieModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const allFilms = this._movieModel.getMoviesAll();
    const filters = Object.entries(FilterName).map(([link, filterName]) => {
      return {
        name: filterName,
        link,
        count: getFilmsByFilter(allFilms, filterName).length,
        isActive: filterName.split(` `)[0] === this._activeFilterName.split(` `)[0],
      };
    });
    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);

    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      renderHtmlPart(this._container, this._filterComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterName) {
    this._movieModel.setFilter(filterName);
    this._activeFilterName = filterName;
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
