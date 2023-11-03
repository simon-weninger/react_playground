import { ArrowUturnLeftIcon, CubeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useRef } from "react";
import { useActiveStringBuilderId } from "../ActiveStringBuilderContext";
import { useStringBuilderClass } from "./StringBuilderContextClass";
import { StringBuilderElement, TextElement } from "./classes/AbstractElement";
import { metaPixelBasicPayload } from "./data-mock";
import DragElement from "./elements/DragElement";
import DropZone from "./elements/DropZone";

interface StringBuilderClassProps {
  id: string;
}
/**
 * The StringBuilderNew component
 * @param {StringBuilderClassProps} props
 * @return {ReactElement}
 */

const StringBuilderClass = ({ id }: StringBuilderClassProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBuilderId, setActiveBuilderId] = useActiveStringBuilderId();

  const {
    context: { history, elements, selected },
    dispatch,
  } = useStringBuilderClass();

  function handleClick(e: MouseEvent) {
    if (activeBuilderId !== id) {
      setActiveBuilderId(id);
    }
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (activeBuilderId === id) {
      if (e.key === "Delete" || e.key === "Backspace") {
        dispatch({ type: "removeElements", elements: selected });
      }
      if (e.ctrlKey && e.key === "z") {
        dispatch({ type: "undo" });
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [selected, activeBuilderId]);

  useEffect(() => {
    const div = containerRef.current;
    if (div) {
      div.addEventListener("mousedown", handleClick);
      return () => {
        div.removeEventListener("mousedown", handleClick);
      };
    }
  }, []);

  const undoButtonCSS = history.length === 0 ? "text-gray-300" : "text-gray-600";
  const isCurrentContainerCSS = activeBuilderId === id ? "ring-sky-600" : " ring-gray-100";

  return (
    <div ref={containerRef} className={`ring-1 shadow m-2 rounded-md p-2 ${isCurrentContainerCSS}`}>
      <div className="flex gap-2 border-b pb-2 ">
        <button
          className={`flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 text-xs ${undoButtonCSS}`}
          onClick={() => dispatch({ type: "undo" })}
        >
          <ArrowUturnLeftIcon className="h-5" />
        </button>
        <button
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 text-gray-600 text-xs"
          onClick={() => dispatch({ type: "removeElements", elements: selected })}
        >
          <TrashIcon className="h-5" />
        </button>
        <button
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 text-gray-600 text-xs"
          onClick={() => dispatch({ type: "wrapInContentBlock" })}
        >
          <CubeIcon className="h-5" />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-y-2 mt-2">
        {metaPixelBasicPayload.map((element) => (
          <DragElement key={element.getId() + "-drag"} element={element} disabled />
        ))}
        {elements.map((element) => (
          <Fragment key={element.getId()}>
            <DropZone elementId={element.getId()} />
            <DragElement element={element} />
          </Fragment>
        ))}
        <DropZone elementId="last" />
        <button
          className={`flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 text-xs ${undoButtonCSS}`}
          onClick={() =>
            dispatch({ type: "addElements", elementIdToInsertBefore: "last", elements: [new TextElement("")] })
          }
        >
          <div>{<PlusIcon className="h-5" />}</div>
        </button>
      </div>
    </div>
  );
};

export default StringBuilderClass;

const startTransferData = (e: DragEvent, elements: StringBuilderElement[]) => {
  e.dataTransfer?.setData("elements", JSON.stringify(elements));
};

const getTransferredData = (e: DragEvent): StringBuilderElement[] => {
  return JSON.parse(e.dataTransfer?.getData("elements") || "[]");
};
