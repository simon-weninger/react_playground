import { find } from "lodash";
import { generateId } from "../utils";
import { PixelBuilderElement, PixelBuilderRecursiveElement } from "./types";

export const forEachRecursive = (element: PixelBuilderElement, cb: (e: PixelBuilderElement) => void) => {
  cb(element);
  if (isRecursiveElement(element)) {
    element.children.forEach((e) => forEachRecursive(e, cb));
  }
};

export const isRecursiveElement = (element: PixelBuilderElement): element is PixelBuilderRecursiveElement => {
  if (element.type === "CONTENT_BLOCK" || element.type === "FUNCTION") return true;
  return false;
};

export const flattenPixelBuilderElements = (elements: PixelBuilderElement[]) => {
  const arr: PixelBuilderElement[] = [];

  const cb = (element: PixelBuilderElement) => {
    arr.push(element);
  };

  elements.forEach((element) => {
    forEachRecursive(element, cb);
  });

  return arr;
};

export const recursivelyMutateIds = (element: PixelBuilderElement) => {
  const cb = (element: PixelBuilderElement) => {
    element.id = generateId();
    if (isRecursiveElement(element)) {
      element.childrenId = generateId();
    }
  };

  forEachRecursive(element, cb);
};

export const findElement = (elementId: string, elements: PixelBuilderElement[]): PixelBuilderElement | undefined => {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    if (element.id === elementId) return element;

    if (isRecursiveElement(element)) {
      const foundElement = findElement(elementId, element.children);
      if (foundElement) return foundElement;
    }
  }
  return undefined;
};

export const removeElement = (elementId: string, elements: PixelBuilderElement[]): PixelBuilderElement | undefined => {
  for (let i = 0; i < elements.length; i++) {
    const iterationElement = elements[i];

    if (iterationElement.id === elementId) {
      elements.splice(i, 1);
      return iterationElement;
    }

    if (isRecursiveElement(iterationElement)) {
      const removedFromInner = removeElement(elementId, iterationElement.children);
      if (removedFromInner) {
        return removedFromInner;
      }
    }
  }
  return undefined;
};

export const addElement = (element: PixelBuilderElement, insertBeforeId: string, elements: PixelBuilderElement[]) => {
  for (let i = 0; i < elements.length; i++) {
    const iterationElement = elements[i];

    if (iterationElement.id === insertBeforeId) {
      elements.splice(i, 0, element);
      return true;
    }

    if (isRecursiveElement(iterationElement)) {
      if (iterationElement.childrenId === insertBeforeId) {
        iterationElement.children.push(element);
        return true;
      }
      const addedElement = addElement(element, insertBeforeId, iterationElement.children);
      if (addedElement) return true;
    }
  }
  return false;
};

export const sortElements = (elementsToSort: PixelBuilderElement[], elements: PixelBuilderElement[]) => {
  let sortedDragElements: PixelBuilderElement[] = [];
  const flatElements = flattenPixelBuilderElements(elements);

  flatElements.forEach((element) => {
    const inElementsToSort = elementsToSort.find((sortElement) => sortElement.id === element.id);
    if (inElementsToSort) {
      sortedDragElements.push(element);
    }
  });

  return sortedDragElements;
};
