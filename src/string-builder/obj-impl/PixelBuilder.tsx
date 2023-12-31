import { PlusIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useRef } from "react";
import { useActiveStringBuilderId } from "../ActiveStringBuilderContext";
import { usePixelBuilder } from "./PixelBuilderContext";
import PixelBuilderToolBar from "./PixelBuilderToolBar";
import { metaPixelBasicPayload } from "./data-mock";
import ContextMenu from "./elements/context-menu/ContextMenu";
import DragElement from "./elements/DragElement";
import DropZone from "./elements/DropZone";
import { createTextElement } from "./factoryMethods";
import Dialog from "../components/Dialog";

interface PixelBuilderProps {
  id: string;
}
/**
 * The PixelBuilder component
 * @param {PixelBuilderProps} props
 * @return {ReactElement}
 */
const PixelBuilder = ({ id }: PixelBuilderProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBuilderId, setActiveBuilderId] = useActiveStringBuilderId();

  const {
    context: { elements, selected },
    dispatch,
  } = usePixelBuilder();

  const handleClick = (e: MouseEvent) => {
    if (activeBuilderId !== id) {
      setActiveBuilderId(id);
    }
  };

  useEffect(() => {
    const div = containerRef.current;
    if (div) {
      div.addEventListener("mousedown", handleClick);
      return () => {
        div.removeEventListener("mousedown", handleClick);
      };
    }
  }, []);

  const isCurrentContainerCSS = activeBuilderId === id ? "ring-blue-400" : " ring-gray-100";

  return (
    <>
      <div ref={containerRef} className={`ring-1 shadow m-2 rounded-md p-2 ${isCurrentContainerCSS}`}>
        <PixelBuilderToolBar pixelBuilderId={id} />
        <div className="flex flex-wrap items-center gap-y-2 mt-2">
          {metaPixelBasicPayload.map((element) => (
            <DragElement key={element.id + "-drag"} element={element} disabled />
          ))}
          {elements.map((element) => (
            <Fragment key={element.id}>
              <DropZone elementId={element.id} />
              <DragElement element={element} />
            </Fragment>
          ))}
          <DropZone elementId="last" />
          <button
            className={`flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 text-xs text-gray-400`}
            onClick={() =>
              dispatch({ type: "addElements", elementIdToInsertBefore: "last", elements: [createTextElement("")] })
            }
          >
            <div>{<PlusIcon className="h-5" />}</div>
          </button>
        </div>
      </div>
    </>
  );
};

export default PixelBuilder;
