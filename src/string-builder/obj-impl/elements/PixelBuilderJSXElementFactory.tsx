import { PixelBuilderElement } from "../types";
import ContentBlockStringBuilderElement from "./ContentBlockStringBuilderElement";
import FunctionStringBuilderElement from "./FunctionStringBuilderElement";
import PlaceholderStringBuilderElement from "./PlaceholderStringBuilderElement";
import TextStringBuilderElement from "./TextStringBuilderElement";

interface PixelBuilderJSXElementFactoryProps {
  element: PixelBuilderElement;
}
/**
 * The PixelBuilderJSXElementFactory component
 * @param {PixelBuilderJSXElementFactoryProps} props
 * @return {ReactElement}
 */
const PixelBuilderJSXElementFactory = ({ element }: PixelBuilderJSXElementFactoryProps): JSX.Element => {
  if (element.type === "TEXT") {
    return <TextStringBuilderElement element={element} />;
  }
  if (element.type === "PLACEHOLDER") {
    return <PlaceholderStringBuilderElement element={element} />;
  }
  if (element.type === "FUNCTION") {
    return <FunctionStringBuilderElement element={element} />;
  }
  if (element.type === "CONTENT_BLOCK") {
    return <ContentBlockStringBuilderElement element={element} />;
  }
  throw new Error("JSX Element Factory: Unknown Element");
};

export default PixelBuilderJSXElementFactory;
