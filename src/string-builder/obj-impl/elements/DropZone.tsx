import { useEffect, useRef, useState } from "react";
import { usePixelBuilder } from "../PixelBuilderContext";
import { forEachRecursive, isRecursiveElement } from "../pixelBuilderHelperFunctions";

const DEFAULT_DROPZONE_WITH = 8;

interface DropZoneProps {
  elementId: string;
}
/**
 * The DropZone component
 * @param {DropZoneProps} props
 * @return {ReactElement}
 */
const DropZone = ({ elementId }: DropZoneProps): JSX.Element => {
  const {
    dispatch,
    context: { drag },
  } = usePixelBuilder();
  const [width, setWidth] = useState(`${DEFAULT_DROPZONE_WITH}px`);

  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();

    dispatch({
      type: "moveElements",
      elementIdToInsertBefore: elementId,
      copyAction: e.ctrlKey,
    });

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
      const buffer = 180;
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
      const isDragged = drag.elements.find((e) => e.id === elementId);
      let isChildOfDragged = false;

      drag.elements.forEach((element) =>
        forEachRecursive(element, (child) => {
          if (child.id === elementId) isChildOfDragged = true;
          if (isRecursiveElement(child) && child.childrenId === elementId) isChildOfDragged = true;
        })
      );

      if (!isDragged && !isChildOfDragged) {
        addEventListeners(dropZone);
      }

      return () => {
        removeEventListener(dropZone);
      };
    }
  }, [drag]);

  return <div ref={dropZoneRef} className="min-w-[8px] self-stretch" style={{ width }} />;
};

export default DropZone;
