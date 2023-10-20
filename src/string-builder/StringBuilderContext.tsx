import { createContext, useContext, useReducer } from "react";
import { generateArray } from "./data-mock";
import { StringBuilderElement } from "./types";
import { generateId } from "./utils";

type StringBuilderContext = {
  elements: StringBuilderElement[];
  selected: StringBuilderElement[];
  drag: {
    elements: StringBuilderElement[];
    clientWidth: number;
  };
};

////////////////////////////////////////////////////////////////// NEW
export const StringBuilderContext2 = createContext<{
  context: StringBuilderContext;
  dispatch: React.Dispatch<Action>;
}>({
  context: { elements: [], selected: [], drag: { elements: [], clientWidth: 0 } },
  dispatch: () => {},
});

export function useStringBuilder() {
  return useContext(StringBuilderContext2);
}

export function StringBuilderContextProvider({ children }: { children: React.ReactNode }) {
  const [context, dispatch] = useReducer(elementsReducer, {
    elements: generateArray(),
    selected: [],
    drag: { elements: [], clientWidth: 0 },
  });

  return <StringBuilderContext2.Provider value={{ context, dispatch }}>{children}</StringBuilderContext2.Provider>;
}

type Action =
  | {
      type: "addElements";
      elements: StringBuilderElement[];
      elementIdToInsertBefore: string;
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
    };

function elementsReducer({ elements: prevElements, selected, drag }: StringBuilderContext, action: Action) {
  const newElements = cloneDeep(prevElements);

  switch (action.type) {
    case "addElements": {
      action.elements.forEach((iterationElement) => {
        const addedSuccessful = addElementRecursive(iterationElement, action.elementIdToInsertBefore, newElements);

        if (!addedSuccessful) throw new Error("Could not add element successfully!");
      });

      return { elements: newElements, selected, drag };
    }

    case "dragStart": {
      const dragElements = sortRecursiveAndRemoveChildrenFromOuterScope(cloneDeep(action.elements), prevElements);
      return { elements: prevElements, selected, drag: { elements: dragElements, clientWidth: action.elementClientWidth } };
    }

    case "dragEnd": {
      return { elements: prevElements, selected, drag: { elements: [], clientWidth: 0 } };
    }

    case "moveElementsLast": {
      drag.elements.forEach((element) => {
        removeElementRecursive(element, newElements);
        newElements.push(element);
      });

      return { elements: newElements, selected, drag: { elements: [], clientWidth: 0 } };
    }

    case "moveElements": {
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

      return { elements: newElements, selected, drag: { elements: [], clientWidth: 0 } };
    }

    case "removeElements": {
      action.elements.forEach((element) => {
        removeElementRecursive(element, newElements);
      });
      return { elements: newElements, selected, drag };
    }

    case "toggleInSelected": {
      let newSelected = cloneDeep(selected);
      if (newSelected.find((sElement) => sElement.id === action.element.id)) {
        newSelected = selected.filter((sElement) => sElement.id !== action.element.id);
      } else {
        newSelected.push(action.element);
      }
      return { elements: prevElements, selected: newSelected, drag };
    }

    default:
      throw Error("Unknown action");
  }

  function sortRecursiveAndRemoveChildrenFromOuterScope(dragElements: StringBuilderElement[], elements: StringBuilderElement[]) {
    let sortedDragElements: StringBuilderElement[] = [];
    for (let i = 0; i < elements.length; i++) {
      const iterationElement = elements[i];

      const inDragElements = dragElements.find((dragElement) => dragElement.id === iterationElement.id);

      if (inDragElements) {
        sortedDragElements.push(inDragElements);
      } else if (iterationElement.type === "FUNCTION") {
        sortedDragElements = sortedDragElements.concat(sortRecursiveAndRemoveChildrenFromOuterScope(dragElements, iterationElement.children));
      }
    }
    return sortedDragElements;
  }

  function addElementRecursive(element: StringBuilderElement, insertBeforeId: string, elements: StringBuilderElement[]) {
    for (let i = 0; i < elements.length; i++) {
      const iterationElement = elements[i];

      if (iterationElement.id === insertBeforeId) {
        elements.splice(i, 0, element);
        return true;
      }
      if (iterationElement.type === "FUNCTION") {
        if (iterationElement.childrenId === insertBeforeId) {
          iterationElement.children.push(element);
          return true;
        }
        const addedElement = addElementRecursive(element, insertBeforeId, iterationElement.children);
        if (addedElement) return true;
      }
    }
    return false;
  }

  function removeElementRecursive(element: StringBuilderElement, elementsRef: StringBuilderElement[]): StringBuilderElement | undefined {
    for (let i = 0; i < elementsRef.length; i++) {
      const iterationElement = elementsRef[i];

      if (iterationElement.id === element.id) {
        elementsRef.splice(i, 1);
        return iterationElement;
      }
      if (iterationElement.type === "FUNCTION") {
        const removedFromInner = removeElementRecursive(element, iterationElement.children);
        if (removedFromInner) {
          return removedFromInner;
        }
      }
    }
    return undefined;
  }

  function mutateIdRecursive(element: StringBuilderElement) {
    if (element.type === "FUNCTION") {
      element.childrenId = generateId();
      element.children.forEach((child) => {
        mutateIdRecursive(child);
      });
    }
    element.id = generateId();
  }
}

function cloneDeep<T>(element: T): T {
  return JSON.parse(JSON.stringify(element));
}
