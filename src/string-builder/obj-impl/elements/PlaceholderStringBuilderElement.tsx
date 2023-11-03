import ContentEditable from "../ContentEditable";
import { usePixelBuilder } from "../PixelBuilderContext";
import { PixelBuilderPlaceholder } from "../types";

interface PlaceholderStringBuilderElementProps {
  element: PixelBuilderPlaceholder;
}
/**
 * The PlaceholderStringBuilderElement component
 * @param {PlaceholderStringBuilderElementProps} props
 * @return {ReactElement}
 */
const PlaceholderStringBuilderElement = ({ element }: PlaceholderStringBuilderElementProps): JSX.Element => {
  let wrapperColorStyles = "border-sky-50 bg-sky-50";
  let placeholderColorStyles = "bg-sky-200";

  if (element.optional) {
    wrapperColorStyles = "border-sky-400 bg-sky-50";
  }

  return (
    <div className={"flex items-center border-l-2 border-r-2 p-1 rounded text-sky-950 " + wrapperColorStyles}>
      <ContentEditable
        elementId={element.id}
        className="pr-1"
        text={element.stringBefore}
        onChange={(value: string) => (element.stringBefore = value)}
      />
      <div className={"py-1 px-2 rounded " + placeholderColorStyles}>{element.label}</div>
      <ContentEditable
        elementId={element.id}
        className="pl-1"
        text={element.stringAfter}
        onChange={(value: string) => (element.stringAfter = value)}
      />
    </div>
  );
};

export default PlaceholderStringBuilderElement;
