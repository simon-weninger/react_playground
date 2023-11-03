import _ from "lodash";
import { createContext, useContext, useReducer } from "react";
import { metaPixelPayload } from "./data-mock";
import { createContentBlock } from "./factoryMethods";
import {
  addElement,
  findElement,
  flattenPixelBuilderElements,
  forEachRecursive,
  recursivelyMutateIds,
  removeElement,
  sortElements,
} from "./pixelBuilderHelperFunctions";
import { PixelBuilderElement } from "./types";

type PixelBuilderContext = {
  history: PixelBuilderElement[][];
  elements: PixelBuilderElement[];
  selected: PixelBuilderElement[];
  drag: {
    elements: PixelBuilderElement[];
    clientWidth: number;
  };
};

export const PixelBuilderContext = createContext<{
  context: PixelBuilderContext;
  dispatch: React.Dispatch<Action>;
}>({
  context: { history: [], elements: [], selected: [], drag: { elements: [], clientWidth: 0 } },
  dispatch: () => {},
});

export function usePixelBuilder() {
  return useContext(PixelBuilderContext);
}

export function PixelBuilderContextProvider({ children }: { children: React.ReactNode }) {
  const [context, dispatch] = useReducer(elementsReducer, {
    history: [],
    elements: metaPixelPayload,
    selected: [],
    drag: { elements: [], clientWidth: 0 },
  });

  return <PixelBuilderContext.Provider value={{ context, dispatch }}>{children}</PixelBuilderContext.Provider>;
}

type Action =
  | {
      type: "addElements";
      elements: PixelBuilderElement[];
      elementIdToInsertBefore: string;
    }
  | {
      type: "removeElements";
      elements: PixelBuilderElement[];
    }
  | {
      type: "moveElements";
      elementIdToInsertBefore: string;
      copyAction: boolean;
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
      type: "copySelected";
    }
  | {
      type: "pasteFromClipboard";
    }
  | {
      type: "duplicateSelected";
    }
  | {
      type: "dragStart";
      elements: PixelBuilderElement[];
      elementClientWidth: number;
    }
  | {
      type: "dragEnd";
    }
  | {
      type: "wrapInContentBlock";
    }
  | {
      type: "toggleInSelected";
      element: PixelBuilderElement;
    }
  | {
      type: "selectRange";
      element: PixelBuilderElement;
    }
  | {
      type: "unselectAll";
    };

function elementsReducer(context: PixelBuilderContext, action: Action) {
  const { history, elements: prevElements, selected, drag } = context;

  switch (action.type) {
    case "undo": {
      const lastElement = getLastHistoryElement();

      if (lastElement) {
        return { history, elements: lastElement, selected, drag };
      }
      return context;
    }

    case "textChangeStart": {
      const newElements = prevElements.map((element) => {
        const clone = _.cloneDeep(element);
        return clone;
      });
      addToHistory(newElements);

      return context;
    }

    case "textChangeEnd": {
      const lastHistoryElement = history.at(-1);
      if (lastHistoryElement) {
        const oldElement = findElement(action.elementId, lastHistoryElement);
        const newElement = findElement(action.elementId, prevElements);

        if (!(newElement?.type === "CONTENT_BLOCK") && !(oldElement?.type === "CONTENT_BLOCK")) {
          if (!(newElement?.type === "TEXT") && !(oldElement?.type === "TEXT")) {
            if (
              oldElement?.stringBefore === newElement?.stringBefore &&
              oldElement?.stringAfter === newElement?.stringAfter
            ) {
              history.pop();
            }
          } else if (newElement?.type === "TEXT" && oldElement?.type === "TEXT") {
            if (oldElement.value === newElement.value) {
              history.pop();
            }
          }
        }
      }

      return { history, elements: prevElements, selected, drag };
    }

    case "copySelected": {
      const clonedSelected = _.cloneDeep(selected);
      clonedSelected.forEach((e) => recursivelyMutateIds(e));
      sessionStorage.setItem("elementClipboard", JSON.stringify(clonedSelected));
      return context;
    }

    case "pasteFromClipboard": {
      if (selected.length === 0) return context;

      const clipboardString = sessionStorage.getItem("elementClipboard");

      if (clipboardString === null) return context;

      try {
        const data = JSON.parse(clipboardString) as PixelBuilderElement[];
        addToHistory(prevElements);
        const newElements = prevElements.map((element) => _.cloneDeep(element));

        const sortedSelected = sortElements(selected, newElements);

        data.forEach((element) => {
          const addedSuccessful = addElement(element, sortedSelected[0].id, newElements);

          if (!addedSuccessful) throw new Error("Could not add element successfully!");
        });

        return { history, elements: newElements, selected, drag };
      } catch (e) {
        return context;
      }
    }

    case "duplicateSelected": {
      if (selected.length === 0) return context;
      addToHistory(prevElements);
      const newElements = prevElements.map((element) => _.cloneDeep(element));

      prevElements.forEach((element) => {
        forEachRecursive(element, (e) => {
          const foundElement = selected.find((selectedElement) => selectedElement.id === e.id);
          if (foundElement) {
            const clone = _.cloneDeep(foundElement);
            recursivelyMutateIds(clone);
            addElement(clone, e.id, newElements);
          }
        });
      });

      return { history, elements: newElements, selected, drag };
    }

    case "addElements": {
      addToHistory(prevElements);
      const newElements = prevElements.map((element) => _.cloneDeep(element));

      if (action.elementIdToInsertBefore === "last") {
        return {
          history: history,
          elements: newElements.concat(action.elements),
          selected: selected,
          drag: drag,
        };
      }

      action.elements.forEach((iterationElement) => {
        const addedSuccessful = addElement(iterationElement, action.elementIdToInsertBefore, newElements);

        if (!addedSuccessful) throw new Error("Could not add element successfully!");
      });

      return { history: history, elements: newElements, selected: selected, drag: drag };
    }

    case "wrapInContentBlock": {
      if (selected.length === 0) return { history: history, elements: prevElements, selected: selected, drag: drag };
      addToHistory(prevElements);

      const newElements = prevElements.map((element) => _.cloneDeep(element));

      const sortedSelected = sortElements(selected, newElements);

      const clonedSortedSelected = sortedSelected.map((e) => {
        const clone = _.cloneDeep(e);
        recursivelyMutateIds(clone);
        return clone;
      });

      addElement(createContentBlock(clonedSortedSelected), sortedSelected[0].id, newElements);
      sortedSelected.forEach((e) => removeElement(e.id, newElements));

      return { history: history, elements: newElements, selected: [], drag: drag };
    }

    case "dragStart": {
      const clonedDragElements = action.elements.map((e) => _.cloneDeep(e));
      const dragElements = sortElements(clonedDragElements, prevElements);

      sessionStorage.setItem("drag", JSON.stringify(dragElements));

      return {
        history: history,
        elements: prevElements,
        selected: selected,
        drag: { elements: dragElements, clientWidth: action.elementClientWidth },
      };
    }

    case "dragEnd": {
      return {
        history: history,
        elements: prevElements,
        selected: selected,
        drag: { elements: [], clientWidth: 0 },
      };
    }

    case "moveElements": {
      addToHistory(prevElements);
      const newElements = prevElements.map((element) => _.cloneDeep(element));

      drag.elements.forEach((element) => {
        if (action.copyAction) {
          recursivelyMutateIds(element);
        } else {
          removeElement(element.id, newElements);
        }
        if (action.elementIdToInsertBefore === "last") {
          newElements.push(element);
        } else {
          const addedSuccessful = addElement(element, action.elementIdToInsertBefore, newElements);
          if (!addedSuccessful) throw new Error("Could not add element successfully!");
        }
      });

      return { history: history, elements: newElements, selected: selected, drag: { elements: [], clientWidth: 0 } };
    }

    case "removeElements": {
      if (action.elements.length === 0) return context;

      addToHistory(prevElements);
      const newElements = prevElements.map((element) => _.cloneDeep(element));

      action.elements.forEach((element) => {
        removeElement(element.id, newElements);
      });
      const newSelected = selected.filter((element) => !action.elements.find((e) => e.id === element.id));

      return { history: history, elements: newElements, selected: newSelected, drag: drag };
    }

    case "toggleInSelected": {
      let newSelected = selected.map((e) => _.cloneDeep(e));
      if (newSelected.find((sElement) => sElement.id === action.element.id)) {
        newSelected = selected.filter((sElement) => sElement.id !== action.element.id);
      } else {
        newSelected.push(action.element);
      }
      return { history: history, elements: prevElements, selected: newSelected, drag: drag };
    }

    case "selectRange": {
      const flatElements = flattenPixelBuilderElements(prevElements);

      if (selected.length) {
        const clickedElementIndex = flatElements.indexOf(action.element);
        const firstSelectedElementIndex = flatElements.indexOf(selected[0]);

        let selectedElements;

        if (clickedElementIndex > firstSelectedElementIndex) {
          selectedElements = flatElements.slice(firstSelectedElementIndex, clickedElementIndex + 1);
        } else {
          selectedElements = flatElements.slice(clickedElementIndex, firstSelectedElementIndex + 1);
        }

        return { history: history, elements: prevElements, selected: selectedElements, drag: drag };
      } else {
        return { history: history, elements: prevElements, selected: [action.element], drag: drag };
      }
    }

    case "unselectAll": {
      return { history: history, elements: prevElements, selected: [], drag: drag };
    }

    default:
      throw Error("Unknown action");
  }

  function getLastHistoryElement() {
    return history.pop();
  }

  function addToHistory(elements: PixelBuilderElement[]) {
    const maxHistoryLength = 100;

    if (history.length >= maxHistoryLength) {
      history.splice(0, 1);
    }
    history.push(elements);
  }
}
