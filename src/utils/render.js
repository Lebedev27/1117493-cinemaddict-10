import {RenderPosition} from '../constants.js';

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const renderHtmlPart = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component);
      break;
    case RenderPosition.BEFOREEND:
      container.append(component);
      break;
  }
};

const createFragment = (arr) => {
  const fragment = document.createDocumentFragment();
  for (const element of arr) {
    fragment.appendChild(element);
  }
  return fragment;
};

const remove = (component) => {
  component.getElement().remove();
  component.clearElement();
};

export {RenderPosition, createElement, renderHtmlPart, createFragment, remove};
