import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import { ContentBlock } from "../classes/AbstractElement";
import DragElement from "./DragElement";
import DropZone from "./DropZone";

interface ContentBlockStringBuilderElementProps {
  element: ContentBlock;
}
/**
 * The ContentBlockStringBuilderElement component
 * @param {ContentBlockStringBuilderElementProps} props
 * @return {ReactElement}
 */
const ContentBlockStringBuilderElement = ({ element }: ContentBlockStringBuilderElementProps): JSX.Element => {
  const [show, setShow] = useState(true);

  return (
    <div className="p-2 bg-gray-100 border border-gray-300 rounded ">
      <div className="flex items-center min-h-[24px]">
        <span className="text-gray-600 text-xs">{element.getLabel()}</span>
        <button
          className="px-0.5 py-0.5 ml-2 rounded hover:bg-gray-300 text-gray-600 text-xs"
          onClick={() => setShow((prev) => !prev)}
        >
          <div>{show ? <EyeSlashIcon className="h-4" /> : <EyeIcon className="h-4" />}</div>
        </button>
      </div>
      {show && (
        <div className="flex flex-wrap gap-y-2 items-center py-1 px-2 min-h-[24px]">
          {element.getChildren().map((element) => (
            <Fragment key={element.getId()}>
              <DropZone elementId={element.getId()} />
              <DragElement element={element} />
            </Fragment>
          ))}
          <DropZone elementId={element.getChildrenId()} />
        </div>
      )}
    </div>
  );
};

export default ContentBlockStringBuilderElement;
