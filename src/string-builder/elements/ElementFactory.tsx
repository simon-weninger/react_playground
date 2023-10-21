import {
  ContentBlock,
  FunctionElement,
  PlaceholderElement,
  StringBuilderElement,
  TextElement,
} from "../classes/AbstractElement";
import ContentBlockStringBuilderElement from "./ContentBlockStringBuilderElement";
import FunctionStringBuilderElement from "./FunctionStringBuilderElement";
import PlaceholderStringBuilderElement from "./PlaceholderStringBuilderElement";
import TextStringBuilderElement from "./TextStringBuilderElement";

interface ElementFactoryProps {
  element: StringBuilderElement;
}
/**
 * The ElementFactory component
 * @param {ElementFactoryProps} props
 * @return {ReactElement}
 */
const ElementFactory = ({ element }: ElementFactoryProps): JSX.Element => {
  if (element instanceof TextElement) {
    return <TextStringBuilderElement element={element} />;
  }
  if (element instanceof PlaceholderElement) {
    return <PlaceholderStringBuilderElement element={element} />;
  }
  if (element instanceof FunctionElement) {
    return <FunctionStringBuilderElement element={element} />;
  }
  if (element instanceof ContentBlock) {
    return <ContentBlockStringBuilderElement element={element} />;
  }
  throw new Error("Element Factory: Unknown Element");
};

export default ElementFactory;
