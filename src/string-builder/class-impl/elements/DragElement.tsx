import { useRef, useState, useEffect } from "react";
import { useStringBuilderClass } from "../StringBuilderContextClass";
import { StringBuilderElement } from "../classes/AbstractElement";
import ElementFactory from "./ElementFactory";

import Checkbox from "@assets/Checkbox.svg";

interface DragElementProps {
  element: StringBuilderElement;
  disabled?: boolean;
}
/**
 * The DragElement component
 * @param {DragElementProps} props
 * @return {ReactElement}
 */
const DragElement = ({ element, disabled = false }: DragElementProps): JSX.Element => {
  const dragElementRef = useRef<HTMLDivElement>(null);
  const [isDragged, setIsDragged] = useState(false);
  const {
    context: { selected, drag },
    dispatch,
  } = useStringBuilderClass();

  const handleClick = (e: MouseEvent) => {
    if (e.ctrlKey) {
      dispatch({ type: "toggleInSelected", element });
      e.stopPropagation();
    }
    if (e.shiftKey) {
      dispatch({ type: "selectRange", element });
      e.stopPropagation();
    }
    if (!e.shiftKey && !e.ctrlKey) {
      dispatch({ type: "unselectAll" });
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
    if (ele && !disabled) {
      ele.addEventListener("dragstart", handleDragStart);
      ele.addEventListener("dragend", handleDragEnd);
      ele.addEventListener("click", handleClick);

      return () => {
        ele.removeEventListener("dragstart", handleDragStart);
        ele.removeEventListener("dragend", handleDragEnd);
        ele.removeEventListener("click", handleClick);
      };
    }
  }, [element, selected]);

  return (
    <div className="relative">
      {selected.find((selectedElement) => selectedElement.getId() === element.getId()) && (
        <img className="absolute top-0 left-0 w-4 -translate-x-1/2 -translate-y-1/2" src={Checkbox} />
      )}
      <div
        ref={dragElementRef}
        style={{ opacity: isDragged ? 0.2 : 1 }}
        className={`flex items-center ${disabled ? "text-gray-400" : "cursor-grab text-gray-800"}`}
        draggable={!disabled}
      >
        <ElementFactory element={element} />
      </div>
    </div>
  );
};

export default DragElement;
