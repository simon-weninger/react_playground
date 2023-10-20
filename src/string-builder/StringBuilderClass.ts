import { StringBuilderElement } from "./types";

export class StringBuilder {
  private elements: StringBuilderElement[];

  constructor(elements: StringBuilderElement[]) {
    this.elements = elements;
  }

  public getElements() {
    return cloneDeep(this.elements);
  }

  public addNewElement(element: StringBuilderElement) {
    this.elements.push(element);
  }

  public moveElement(id: string, insertBeforeId: string) {
    const element = this.removeElement(id);
    const addedSuccessful = this.addElementRecursive(
      element,
      insertBeforeId,
      this.elements
    );

    if (!addedSuccessful)
      throw new Error("Could not add element successfully!");
  }

  private addElementRecursive(
    element: StringBuilderElement,
    insertBeforeId: string,
    elements: StringBuilderElement[]
  ) {
    for (let i = 0; i < elements.length; i++) {
      const e = elements[i];
      if (e.id === insertBeforeId) {
        elements.splice(i, 0, element);
        return true;
      }
      if (e.type === "FUNCTION") {
        if (e.childrenId === insertBeforeId) {
          e.children.push(element);
          return true;
        }
        const addedElement = this.addElementRecursive(
          element,
          insertBeforeId,
          e.children
        );
        if (addedElement) return true;
      }
    }
    return false;
  }

  public removeElement(id: string): StringBuilderElement {
    const element = this.removeElementRecursive(id, this.elements);
    if (!element) {
      throw new Error(`Element with id ${id} not found!`);
    }
    return element;
  }

  private removeElementRecursive(
    id: string,
    elements: StringBuilderElement[]
  ): StringBuilderElement | undefined {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.id === id) {
        elements.splice(i, 1);
        return element;
      }
      if (element.type === "FUNCTION") {
        const removedFromInner = this.removeElementRecursive(
          id,
          element.children
        );
        if (removedFromInner) {
          return removedFromInner;
        }
      }
    }
    return undefined;
  }
}

function cloneDeep<T>(element: T): T {
  return JSON.parse(JSON.stringify(element));
}
