import {RenderPosition} from '../constants.js';

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const renderHtmlPart = (container, component, place) => {
  if (place === RenderPosition.AFTERBEGIN) {
    container.prepend(component);
  } else {
    container.append(component);
  }
};

const createFragment = (elements) => {
  const fragment = document.createDocumentFragment();
  for (const element of elements) {
    fragment.appendChild(element);
  }
  return fragment;
};

const remove = (component) => {
  component.getElement().remove();
  component.clearElement();
};

const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

export {RenderPosition, createElement, renderHtmlPart, createFragment, remove, replace};
