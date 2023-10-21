import ContentEditable from "../ContentEditable";
import { TextElement } from "../classes/AbstractElement";

interface TextStringBuilderElementProps {
  element: TextElement;
}
/**
 * The TextStringBuilderElement component
 * @param {TextStringBuilderElementProps} props
 * @return {ReactElement}
 */
const TextStringBuilderElement = ({ element }: TextStringBuilderElementProps): JSX.Element => {
  return (
    <div className="p-1 flex rounded bg-slate-50 border border-slate-200  ">
      <ContentEditable
        style={{ color: element.getColor() }}
        text={element.getLabel()}
        onChange={(value: string) => {
          element.setValue(value);
        }}
      />
    </div>
  );
};

export default TextStringBuilderElement;
