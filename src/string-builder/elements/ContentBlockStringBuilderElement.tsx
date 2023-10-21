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
  return (
    <div className="py-1 px-2 bg-slate-100 border border-slate-500 rounded ">
      {element.getLabel()}
      <div className="flex flex-wrap gap-y-2 items-center py-1 px-2 min-h-[24px]">
        {element.getChildren().map((element) => (
          <>
            <DropZone key={element.getId() + "-drop"} elementId={element.getId()} />
            <DragElement key={element.getId() + "-drag"} element={element} />
          </>
        ))}
        <DropZone elementId={element.getChildrenId()} />
      </div>
    </div>
  );
};

export default ContentBlockStringBuilderElement;
