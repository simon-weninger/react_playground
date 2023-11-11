import { useEffect, useRef, useState } from "react";

import Checkbox from "@assets/Checkbox.svg";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { usePixelBuilder } from "../PixelBuilderContext";
import { PixelBuilderElement } from "../types";
import PixelBuilderJSXElementFactory from "./PixelBuilderJSXElementFactory";

interface DragElementProps {
  element: PixelBuilderElement;
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
  } = usePixelBuilder();

  const handleClick = (e: MouseEvent) => {
    if (e.ctrlKey) {
      dispatch({ type: "toggleInSelected", element });
      e.stopPropagation();
    }
    if (e.shiftKey) {
      dispatch({ type: "selectRange", element });
      e.stopPropagation();
    }
    if (selected.length > 0 && !e.shiftKey && !e.ctrlKey) {
      dispatch({ type: "unselectAll" });
    }
  };

  const handleDragStart = (e: DragEvent) => {
    e.stopPropagation();
    const elementClientWidth = dragElementRef.current?.clientWidth || 100;
    if (selected.find((selectedElement) => selectedElement.id === element.id)) {
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
    if (drag.elements.find((e) => e.id === element.id)) {
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
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div className="relative">
          {selected.find((selectedElement) => selectedElement.id === element.id) && (
            <img className="absolute top-0 left-0 w-4 -translate-x-1/2 -translate-y-1/2" src={Checkbox} />
          )}
          <div
            ref={dragElementRef}
            style={{ opacity: isDragged ? 0.2 : 1 }}
            className={`flex items-center ${disabled ? "text-gray-300" : "cursor-grab text-gray-800"}`}
            draggable={!disabled}
          >
            <PixelBuilderJSXElementFactory element={element} disabled={disabled} />
          </div>
        </div>
      </ContextMenu.Trigger>
    </ContextMenu.Root>
  );
};

export default DragElement;
