import { Children, createContext, useContext, useReducer } from "react";
import { ContentBlock, StringBuilderElement, TextElement, isRecursiveElement } from "./classes/AbstractElement";
import { metaPixelPayload } from "./data-mock";
import { generateId } from "../utils";

type StringBuilderContextClass = {
  history: StringBuilderElement[][];
  elements: StringBuilderElement[];
  selected: StringBuilderElement[];
  drag: {
    elements: StringBuilderElement[];
    clientWidth: number;
  };
};

export const StringBuilderContextClass = createContext<{
  context: StringBuilderContextClass;
  dispatch: React.Dispatch<Action>;
}>({
  context: { history: [], elements: [], selected: [], drag: { elements: [], clientWidth: 0 } },
  dispatch: () => {},
});

export function useStringBuilderClass() {
  return useContext(StringBuilderContextClass);
}

export function StringBuilderContextClassProvider({ children }: { children: React.ReactNode }) {
  const [context, dispatch] = useReducer(elementsReducer, {
    history: [],
    elements: metaPixelPayload,
    selected: [],
    drag: { elements: [], clientWidth: 0 },
  });

  return (
    <StringBuilderContextClass.Provider value={{ context, dispatch }}>{children}</StringBuilderContextClass.Provider>
  );
}

type Action =
  | {
      type: "addElements";
      elements: StringBuilderElement[];
      elementIdToInsertBefore: string;
    }
  | {
      type: "undo";
    }
  | {
      type: "textChangeStart";
    }
  | {
      type: "textChangeEnd";
      elementId: string;
    }
  | {
      type: "moveElementsLast";
      copyAction: boolean;
    }
  | {
      type: "dragStart";
      elements: StringBuilderElement[];
      elementClientWidth: number;
    }
  | {
      type: "dragEnd";
    }
  | {
      type: "moveElements";
      elementIdToInsertBefore: string;
      copyAction: boolean;
    }
  | {
      type: "removeElements";
      elements: StringBuilderElement[];
    }
  | {
      type: "toggleInSelected";
      element: StringBuilderElement;
    }
  | {
      type: "selectRange";
      element: StringBuilderElement;
    }
  | {
      type: "wrapInContentBlock";
    }
  | {
      type: "unselectAll";
    };

function elementsReducer(
  { history, elements: prevElements, selected, drag }: StringBuilderContextClass,
  action: Action
) {
  switch (action.type) {
    case "undo": {
      const lastElement = getLasthistoryElement();

      if (lastElement) {
        return { history, elements: lastElement, selected, drag };
      }
      return { history, elements: prevElements, selected, drag };
    }

    case "textChangeStart": {
      const newElements = prevElements.map((element) => {
        const clone = element.cloneDeep();
        return clone;
      });
      addToHistory(newElements);

      return { history, elements: prevElements, selected, drag };
    }

    case "textChangeEnd": {
      const lasthistoryElement = history.at(-1);
      if (lasthistoryElement) {
        const oldElement = findRecursive(action.elementId, lasthistoryElement);
        const newElement = findRecursive(action.elementId, prevElements);

        if (!(newElement instanceof ContentBlock) && !(oldElement instanceof ContentBlock)) {
          if (!(newElement instanceof TextElement) && !(oldElement instanceof TextElement)) {
            if (
              oldElement?.getStringBefore() === newElement?.getStringBefore() &&
              oldElement?.getStringAfter() === newElement?.getStringAfter()
            ) {
              history.pop();
            }
          } else if (newElement instanceof TextElement && oldElement instanceof TextElement) {
            if (oldElement.getValue() === newElement.getValue()) {
              history.pop();
            }
          }
        }
      }

      return { history, elements: prevElements, selected, drag };
    }

    case "addElements": {
      addToHistory(prevElements);
      const newElements = prevElements.map((element) => element.cloneDeep());

      if (action.elementIdToInsertBefore === "last") {
        return { history, elements: newElements.concat(action.elements), selected, drag };
      }

      action.elements.forEach((iterationElement) => {
        const addedSuccessful = addElementRecursive(iterationElement, action.elementIdToInsertBefore, newElements);

        if (!addedSuccessful) throw new Error("Could not add element successfully!");
      });

      return { history, elements: newElements, selected, drag };
    }

    case "wrapInContentBlock": {
      if (selected.length === 0) return { history, elements: prevElements, selected, drag };
      addToHistory(prevElements);

      const newElements = prevElements.map((element) => element.cloneDeep());

      const sortedSelected = sortRecursiveAndRemoveChildrenFromOuterScope(selected, newElements);

      const clonedSortedSelected = sortedSelected.map((e) => {
        const clone = e.cloneDeep();
        mutateIdRecursive(clone);
        return clone;
      });

      addElementRecursive(new ContentBlock(clonedSortedSelected), sortedSelected[0].getId(), newElements);
      sortedSelected.forEach((e) => removeElementRecursive(e, newElements));

      return { history, elements: newElements, selected: [], drag };
    }

    case "dragStart": {
      const clonedDragElements = action.elements.map((e) => e.cloneDeep());
      const dragElements = sortRecursiveAndRemoveChildrenFromOuterScope(clonedDragElements, prevElements);

      sessionStorage.setItem("drag", JSON.stringify(dragElements));

      return {
        history,
        elements: prevElements,
        selected,
        drag: { elements: dragElements, clientWidth: action.elementClientWidth },
      };
    }

    case "dragEnd": {
      return { history, elements: prevElements, selected, drag: { elements: [], clientWidth: 0 } };
    }

    case "moveElementsLast": {
      addToHistory(prevElements);
      const newElements = prevElements.map((element) => element.cloneDeep());

      drag.elements.forEach((element) => {
        removeElementRecursive(element, newElements);
        newElements.push(element);
      });

      return { history, elements: newElements, selected, drag: { elements: [], clientWidth: 0 } };
    }

    case "moveElements": {
      addToHistory(prevElements);
      const newElements = prevElements.map((element) => element.cloneDeep());

      drag.elements.forEach((element) => {
        if (action.copyAction) {
          mutateIdRecursive(element);
        } else {
          const addedToOtherStringBuilder = removeElementRecursive(element, newElements) === undefined;
          if (addedToOtherStringBuilder) {
            mutateIdRecursive(element);
          }
        }
        const addedSuccessful = addElementRecursive(element, action.elementIdToInsertBefore, newElements);

        if (!addedSuccessful) throw new Error("Could not add element successfully!");
      });

      return { history, elements: newElements, selected, drag: { elements: [], clientWidth: 0 } };
    }

    case "removeElements": {
      addToHistory(prevElements);
      const newElements = prevElements.map((element) => element.cloneDeep());

      action.elements.forEach((element) => {
        removeElementRecursive(element, newElements);
      });
      const newSelected = selected.filter((element) => !action.elements.find((e) => e.getId() === element.getId()));

      return { history, elements: newElements, selected: newSelected, drag };
    }

    case "toggleInSelected": {
      let newSelected = selected.map((e) => e.cloneDeep());
      if (newSelected.find((sElement) => sElement.getId() === action.element.getId())) {
        newSelected = selected.filter((sElement) => sElement.getId() !== action.element.getId());
      } else {
        newSelected.push(action.element);
      }
      return { history, elements: prevElements, selected: newSelected, drag };
    }

    case "selectRange": {
      const flatIds = getFlatIdArray(prevElements);

      if (selected.length) {
        const clickedElementIndex = flatIds.indexOf(action.element.getId());
        const firstSelectedElementIndex = flatIds.indexOf(selected[0].getId());

        let selectedIds;

        if (clickedElementIndex > firstSelectedElementIndex) {
          selectedIds = flatIds.slice(firstSelectedElementIndex, clickedElementIndex + 1);
        } else {
          selectedIds = flatIds.slice(clickedElementIndex, firstSelectedElementIndex + 1);
        }
        const newSelected = selectedIds.map((id) => findRecursive(id, prevElements) as StringBuilderElement);
        return { history, elements: prevElements, selected: newSelected, drag };
      } else {
        return { history, elements: prevElements, selected: [action.element], drag };
      }
    }

    case "unselectAll": {
      return { history, elements: prevElements, selected: [], drag };
    }

    default:
      throw Error("Unknown action");
  }

  function getLasthistoryElement() {
    return history.pop();
  }

  function addToHistory(elements: StringBuilderElement[]) {
    const maxhistoryLength = 100;

    if (history.length >= maxhistoryLength) {
      history.splice(0, 1);
    }
    history.push(elements);
  }

  function sortRecursiveAndRemoveChildrenFromOuterScope(
    dragElements: StringBuilderElement[],
    elements: StringBuilderElement[]
  ) {
    let sortedDragElements: StringBuilderElement[] = [];
    for (let i = 0; i < elements.length; i++) {
      const iterationElement = elements[i];

      const inDragElements = dragElements.find((dragElement) => dragElement.getId() === iterationElement.getId());

      if (inDragElements) {
        sortedDragElements.push(inDragElements);
      } else if (isRecursiveElement(iterationElement)) {
        sortedDragElements = sortedDragElements.concat(
          sortRecursiveAndRemoveChildrenFromOuterScope(dragElements, iterationElement.getChildren())
        );
      }
    }
    return sortedDragElements;
  }

  function addElementRecursive(
    element: StringBuilderElement,
    insertBeforeId: string,
    elements: StringBuilderElement[]
  ) {
    for (let i = 0; i < elements.length; i++) {
      const iterationElement = elements[i];

      if (iterationElement.getId() === insertBeforeId) {
        elements.splice(i, 0, element);
        return true;
      }
      if (isRecursiveElement(iterationElement)) {
        if (iterationElement.getChildrenId() === insertBeforeId) {
          iterationElement.getChildren().push(element);
          return true;
        }
        const addedElement = addElementRecursive(element, insertBeforeId, iterationElement.getChildren());
        if (addedElement) return true;
      }
    }
    return false;
  }

  function removeElementRecursive(
    element: StringBuilderElement,
    elementsRef: StringBuilderElement[]
  ): StringBuilderElement | undefined {
    for (let i = 0; i < elementsRef.length; i++) {
      const iterationElement = elementsRef[i];

      if (iterationElement.getId() === element.getId()) {
        elementsRef.splice(i, 1);
        return iterationElement;
      }
      if (isRecursiveElement(iterationElement)) {
        const removedFromInner = removeElementRecursive(element, iterationElement.getChildren());
        if (removedFromInner) {
          return removedFromInner;
        }
      }
    }
    return undefined;
  }

  function mutateIdRecursive(element: StringBuilderElement) {
    if (isRecursiveElement(element)) {
      element.setChildrenId(generateId());
      element.getChildren().forEach((child) => {
        mutateIdRecursive(child);
      });
    }
    element.setId(generateId());
  }

  function findRecursive(id: string, elements: StringBuilderElement[]) {
    let foundElement: StringBuilderElement | undefined;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.forEachRecursive((e) => {
        if (e.getId() === id) {
          foundElement = e;
        }
      });
      if (foundElement) return foundElement;
    }
    return undefined;
  }

  function getFlatIdArray(elements: StringBuilderElement[]) {
    const arr: string[] = [];

    elements.forEach((element) => {
      element.forEachRecursive((e) => {
        arr.push(e.getId());
      });
    });

    return arr;
  }
}
