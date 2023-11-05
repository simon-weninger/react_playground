import { PixelBuilderElement } from "../types";
import ContentBlockStringBuilderElement from "./ContentBlockStringBuilderElement";
import FunctionStringBuilderElement from "./FunctionStringBuilderElement";
import PlaceholderStringBuilderElement from "./PlaceholderStringBuilderElement";
import TextStringBuilderElement from "./TextStringBuilderElement";

interface PixelBuilderJSXElementFactoryProps {
  element: PixelBuilderElement;
  disabled?: boolean;
}
/**
 * The PixelBuilderJSXElementFactory component
 * @param {PixelBuilderJSXElementFactoryProps} props
 * @return {ReactElement}
 */
const PixelBuilderJSXElementFactory = ({
  element,
  disabled = false,
}: PixelBuilderJSXElementFactoryProps): JSX.Element => {
  if (element.type === "TEXT") {
    return <TextStringBuilderElement element={element} disabled={disabled} />;
  }
  if (element.type === "PLACEHOLDER") {
    return <PlaceholderStringBuilderElement element={element} disabled={disabled} />;
  }
  if (element.type === "FUNCTION") {
    return <FunctionStringBuilderElement element={element} disabled={disabled} />;
  }
  if (element.type === "CONTENT_BLOCK") {
    return <ContentBlockStringBuilderElement element={element} disabled={disabled} />;
  }
  throw new Error("JSX Element Factory: Unknown Element");
};

export default PixelBuilderJSXElementFactory;
