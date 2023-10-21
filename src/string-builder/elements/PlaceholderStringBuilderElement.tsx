import ContentEditable from "../ContentEditable";
import { PlaceholderElement, StringBuilderElement } from "../classes/AbstractElement";

interface PlaceholderStringBuilderElementProps {
  element: PlaceholderElement;
}
/**
 * The PlaceholderStringBuilderElement component
 * @param {PlaceholderStringBuilderElementProps} props
 * @return {ReactElement}
 */
const PlaceholderStringBuilderElement = ({ element }: PlaceholderStringBuilderElementProps): JSX.Element => {
  let wrapperColorStyles = "border-sky-300 bg-sky-50";
  let placeholderColorStyles = "bg-sky-600 text-white";

  if (element.getOptional()) {
    wrapperColorStyles = "border-dashed border-sky-800 bg-sky-50";
    placeholderColorStyles = "bg-sky-200 text-sky-950";
  }

  return (
    <div className={"flex items-center border  p-1 rounded " + wrapperColorStyles}>
      <ContentEditable
        className="pr-1"
        text={element.getStringBefore()}
        onChange={(value: string) => element.setStringBefore(value)}
      />
      <div className={"py-1 px-2 rounded " + placeholderColorStyles}>{element.getLabel()}</div>
      {/* <PlaceholderStringBuilderElement element={element} /> */}
      <ContentEditable
        className="pl-1"
        text={element.getStringAfter()}
        onChange={(value: string) => element.setStringAfter(value)}
      />
    </div>
  );
};

export default PlaceholderStringBuilderElement;
