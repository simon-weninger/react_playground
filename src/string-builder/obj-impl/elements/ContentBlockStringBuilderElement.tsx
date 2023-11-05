import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import { PixelBuilderContentBlock } from "../types";
import DragElement from "./DragElement";
import DropZone from "./DropZone";
import ColorSelection from "./context-menu/ColorSelection";
import ContextMenu from "./context-menu/ContextMenu";

interface ContentBlockStringBuilderElementProps {
  element: PixelBuilderContentBlock;
  disabled?: boolean;
}
/**
 * The ContentBlockStringBuilderElement component
 * @param {ContentBlockStringBuilderElementProps} props
 * @return {ReactElement}
 */
const ContentBlockStringBuilderElement = ({
  element,
  disabled = false,
}: ContentBlockStringBuilderElementProps): JSX.Element => {
  const [show, setShow] = useState(true);
  const [color, setColor] = useState(element.color);
  const [contentBlockName, setContentBlockName] = useState(element.label);

  return (
    <div className="p-2 bg-gray-100 border border-gray-300 rounded " style={{ backgroundColor: color }}>
      <div className="flex items-center min-h-[24px]">
        <span className="text-gray-600 text-xs">{contentBlockName}</span>
        <button
          className="px-0.5 py-0.5 ml-2 rounded hover:bg-gray-300 text-gray-600 text-xs"
          onClick={() => setShow((prev) => !prev)}
        >
          <div>{show ? <EyeSlashIcon className="h-4" /> : <EyeIcon className="h-4" />}</div>
        </button>
      </div>
      {show && (
        <div className="flex flex-wrap gap-y-2 items-center py-1 px-2 min-h-[24px]">
          {element.children.map((element) => (
            <Fragment key={element.id}>
              <DropZone elementId={element.id} />
              <DragElement element={element} />
            </Fragment>
          ))}
          <DropZone elementId={element.childrenId} />
        </div>
      )}
      {!disabled && (
        <ContextMenu element={element}>
          <div className="px-[5px] pb-[5px]">
            <p className="text-sky-800 text-xs mb-0.5">Color</p>
            <ColorSelection
              value={color}
              className="bg-gray-100"
              onChange={(value) => {
                setColor(value);
                element.color = value;
              }}
              onReset={() => {
                setColor(undefined);
                element.color = undefined;
              }}
            />
            <p className="text-sky-800 text-xs mt-2 mb-0.5">Label</p>
            <input
              className="outline-none border rounded border-sky-800 w-full p-1 text-sm focus:ring-1 ring-sky-800"
              onChange={(e) => {
                element.label = e.target.value;
                setContentBlockName(e.target.value);
              }}
              value={contentBlockName}
            />
          </div>
        </ContextMenu>
      )}
    </div>
  );
};

export default ContentBlockStringBuilderElement;
