import { createContext, useContext, useReducer } from "react";
import { FunctionElement, StringBuilderElement } from "./classes/AbstractElement";
import { generateArrayNew } from "./data-mock";
import { generateId } from "./utils";

type StringBuilderContext = {
  elements: StringBuilderElement[];
  selected: StringBuilderElement[];
  drag: {
    elements: StringBuilderElement[];
    clientWidth: number;
  };
};

export const StringBuilderContext = createContext<{
  context: StringBuilderContext;
  dispatch: React.Dispatch<Action>;
}>({
  context: { elements: [], selected: [], drag: { elements: [], clientWidth: 0 } },
  dispatch: () => {},
});

export function useStringBuilder() {
  return useContext(StringBuilderContext);
}

export function StringBuilderContextProvider({ children }: { children: React.ReactNode }) {
  const [context, dispatch] = useReducer(elementsReducer, {
    elements: generateArrayNew(),
    selected: [],
    drag: { elements: [], clientWidth: 0 },
  });

  return <StringBuilderContext.Provider value={{ context, dispatch }}>{children}</StringBuilderContext.Provider>;
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
  switch (action.type) {
    case "addElements": {
      const newElements = prevElements.map((element) => element.cloneDeep());

      action.elements.forEach((iterationElement) => {
        const addedSuccessful = addElementRecursive(iterationElement, action.elementIdToInsertBefore, newElements);

        if (!addedSuccessful) throw new Error("Could not add element successfully!");
      });

      return { elements: newElements, selected, drag };
    }

    case "dragStart": {
      const clonedDragElements = action.elements.map((e) => e.cloneDeep());
      const dragElements = sortRecursiveAndRemoveChildrenFromOuterScope(clonedDragElements, prevElements);
      return { elements: prevElements, selected, drag: { elements: dragElements, clientWidth: action.elementClientWidth } };
    }

    case "dragEnd": {
      return { elements: prevElements, selected, drag: { elements: [], clientWidth: 0 } };
    }

    case "moveElementsLast": {
      const newElements = prevElements.map((element) => element.cloneDeep());

      drag.elements.forEach((element) => {
        removeElementRecursive(element, newElements);
        newElements.push(element);
      });

      return { elements: newElements, selected, drag: { elements: [], clientWidth: 0 } };
    }

    case "moveElements": {
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

      return { elements: newElements, selected, drag: { elements: [], clientWidth: 0 } };
    }

    case "removeElements": {
      const newElements = prevElements.map((element) => element.cloneDeep());

      action.elements.forEach((element) => {
        removeElementRecursive(element, newElements);
      });
      return { elements: newElements, selected, drag };
    }

    case "toggleInSelected": {
      let newSelected = selected.map((e) => e.cloneDeep());
      if (newSelected.find((sElement) => sElement.getId() === action.element.getId())) {
        newSelected = selected.filter((sElement) => sElement.getId() !== action.element.getId());
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

      const inDragElements = dragElements.find((dragElement) => dragElement.getId() === iterationElement.getId());

      if (inDragElements) {
        sortedDragElements.push(inDragElements);
      } else if (iterationElement instanceof FunctionElement) {
        sortedDragElements = sortedDragElements.concat(sortRecursiveAndRemoveChildrenFromOuterScope(dragElements, iterationElement.getChildren()));
      }
    }
    return sortedDragElements;
  }

  function addElementRecursive(element: StringBuilderElement, insertBeforeId: string, elements: StringBuilderElement[]) {
    for (let i = 0; i < elements.length; i++) {
      const iterationElement = elements[i];

      if (iterationElement.getId() === insertBeforeId) {
        elements.splice(i, 0, element);
        return true;
      }
      if (iterationElement instanceof FunctionElement) {
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

  function removeElementRecursive(element: StringBuilderElement, elementsRef: StringBuilderElement[]): StringBuilderElement | undefined {
    for (let i = 0; i < elementsRef.length; i++) {
      const iterationElement = elementsRef[i];

      if (iterationElement.getId() === element.getId()) {
        elementsRef.splice(i, 1);
        return iterationElement;
      }
      if (iterationElement instanceof FunctionElement) {
        const removedFromInner = removeElementRecursive(element, iterationElement.getChildren());
        if (removedFromInner) {
          return removedFromInner;
        }
      }
    }
    return undefined;
  }

  function mutateIdRecursive(element: StringBuilderElement) {
    if (element instanceof FunctionElement) {
      element.setChildrenId(generateId());
      element.getChildren().forEach((child) => {
        mutateIdRecursive(child);
      });
    }
    element.setId(generateId());
  }
}
