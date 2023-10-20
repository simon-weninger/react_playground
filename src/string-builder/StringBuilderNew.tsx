import { ReactNode, useEffect, useRef, useState } from "react";
import ContentEditable from "./ContentEditable";
import { useStringBuilder } from "./StringBuilderContextNew";
import { FunctionElement, OptionalPlaceholderElement, PlaceholderElement, StringBuilderElement, TextElement } from "./classes/AbstractElement";

const DEFAULT_DROPZONE_WITH = 8;

const DragElement = ({ element, children }: { element: StringBuilderElement; children?: ReactNode }): JSX.Element => {
  const dragElementRef = useRef<HTMLDivElement>(null);
  const [isDragged, setIsDragged] = useState(false);
  const {
    context: { selected, drag },
    dispatch,
  } = useStringBuilder();

  const handleShiftClick = (e: MouseEvent) => {
    if (e.shiftKey) {
      dispatch({ type: "toggleInSelected", element });
      e.stopPropagation();
    }
  };

  const handleDragStart = (e: DragEvent) => {
    e.stopPropagation();
    const elementClientWidth = dragElementRef.current?.clientWidth || 100;
    if (selected.find((selectedElement) => selectedElement.getId() === element.getId())) {
      dispatch({ type: "dragStart", elements: selected, elementClientWidth });
    } else {
      dispatch({ type: "dragStart", elements: [element], elementClientWidth });
    }
  };

  const handleDragEnd = (e: DragEvent) => {
    e.stopPropagation();
    setIsDragged(false);
    dispatch({ type: "dragEnd" });
  };

  useEffect(() => {
    if (drag.elements.find((e) => e.getId() === element.getId())) {
      setTimeout(() => setIsDragged(true));
    } else {
      setTimeout(() => setIsDragged(false));
    }
  }, [drag]);

  useEffect(() => {
    const ele = dragElementRef.current;
    if (ele) {
      ele.addEventListener("dragstart", handleDragStart);
      ele.addEventListener("dragend", handleDragEnd);
      ele.addEventListener("click", handleShiftClick);

      return () => {
        ele.removeEventListener("dragstart", handleDragStart);
        ele.removeEventListener("dragend", handleDragEnd);
        ele.removeEventListener("click", handleShiftClick);
      };
    }
  }, [element, selected]);

  const getElementClassNames = (element: StringBuilderElement) => {
    if (element instanceof OptionalPlaceholderElement) return "bg-slate-50 border border-dashed border-blue-400 ";
    else if (element instanceof PlaceholderElement) return "bg-blue-400";
    else if (element instanceof FunctionElement) return "bg-orange-200 border border-orange-400";
    else if (element instanceof TextElement) return "bg-slate-50";

    throw new Error("Unknown Element");
  };

  const label = element.getLabel();

  return (
    <div
      id={element.getId()}
      ref={dragElementRef}
      style={{ opacity: isDragged ? 0.2 : 1 }}
      className={`px-1 py-0.5 flex rounded cursor-grab ${getElementClassNames(element)}`}
      draggable
    >
      {selected.find((selectedElement) => selectedElement.getId() === element.getId()) && (
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
          <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
        </svg>
      )}
      {element instanceof OptionalPlaceholderElement ? (
        <>
          <ContentEditable className="pr-1" text={element.getStringBefore()} onChange={(value: string) => element.setStringBefore(value)} />
          <div className="px-1 py-0.5 rounded bg-blue-400">{label}</div>
          <ContentEditable className="pl-1" text={element.getStringAfter()} onChange={(value: string) => element.setStringAfter(value)} />
        </>
      ) : (
        label
      )}
      <div className="pl-3">{element.getId()}</div>
      <div className="flex flex-wrap gap-y-2">{children}</div>
    </div>
  );
};

const DropZone = ({ id, childOfIds }: { id: string; childOfIds: string[] }): JSX.Element => {
  const {
    dispatch,
    context: { drag },
  } = useStringBuilder();
  const [width, setWidth] = useState(`${DEFAULT_DROPZONE_WITH}px`);

  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();

    if (id === "last") {
      dispatch({
        type: "moveElementsLast",
        copyAction: e.ctrlKey,
      });
    } else {
      dispatch({
        type: "moveElements",
        elementIdToInsertBefore: id,
        copyAction: e.ctrlKey,
      });
    }

    setWidth(`${DEFAULT_DROPZONE_WITH}px`);
    e.stopPropagation();
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    const dropZone = dropZoneRef.current;
    if (dropZone) {
      const buffer = 16;
      const availableSpaceRight = window.innerWidth - dropZone.offsetLeft - dropZone.clientWidth - buffer;
      if (availableSpaceRight < drag.clientWidth) {
        setWidth(`${availableSpaceRight}px`);
      } else {
        setWidth(`${drag.clientWidth}px`);
      }
    }

    e.stopPropagation();
  };
  const handleDragLeave = (e: DragEvent) => {
    setWidth(`${DEFAULT_DROPZONE_WITH}px`);
    e.preventDefault();
  };

  const addEventListeners = (dropZone: HTMLDivElement) => {
    dropZone.addEventListener("drop", handleDrop);
    dropZone.addEventListener("dragover", handleDragOver);
    dropZone.addEventListener("dragenter", handleDragEnter);
    dropZone.addEventListener("dragleave", handleDragLeave);
  };

  const removeEventListener = (dropZone: HTMLDivElement) => {
    dropZone.removeEventListener("drop", handleDrop);
    dropZone.removeEventListener("dragover", handleDragOver);
    dropZone.removeEventListener("dragenter", handleDragEnter);
    dropZone.removeEventListener("dragleave", handleDragLeave);
  };

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (dropZone) {
      if (!drag.elements.find((e) => e.getId() === id || childOfIds.includes(e.getId()))) addEventListeners(dropZone);

      return () => {
        removeEventListener(dropZone);
        dropZone.removeEventListener("dragleave", handleDragLeave);
      };
    }
  }, [drag]);

  return <div id={`${id}-dropzone`} ref={dropZoneRef} style={{ minWidth: 8, width }} />;
};

const StringBuilder = (): JSX.Element => {
  const {
    context: { elements },
  } = useStringBuilder();

  return (
    <div className="flex flex-wrap gap-y-2">
      {elements.map((e) => (
        <DropAndDragElement key={e.getId()} element={e} childOfIds={[]} />
      ))}
      <DropZone id="last" childOfIds={[]} />
    </div>
  );
};

export default StringBuilder;

const DropAndDragElement = ({ element, childOfIds }: { element: StringBuilderElement; childOfIds: string[] }): JSX.Element => {
  let child;
  if (element instanceof FunctionElement) {
    const newChildOfIds = childOfIds.concat([element.getId()]);
    child = element.getChildren().map((e) => {
      return <DropAndDragElement key={e.getId()} element={e} childOfIds={newChildOfIds} />;
    });
    child.push(<DropZone key={element.getChildrenId()} id={element.getChildrenId()} childOfIds={newChildOfIds} />);
  }
  return (
    <>
      <DropZone id={element.getId()} childOfIds={childOfIds} />
      <DragElement element={element} children={child} />
    </>
  );
};

const startTransferData = (e: DragEvent, elements: StringBuilderElement[]) => {
  e.dataTransfer?.setData("elements", JSON.stringify(elements));
};

const getTransferredData = (e: DragEvent): StringBuilderElement[] => {
  return JSON.parse(e.dataTransfer?.getData("elements") || "[]");
};
