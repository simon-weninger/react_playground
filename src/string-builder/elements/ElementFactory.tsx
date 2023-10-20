import { StringBuilderElement } from "../types";
import TextElement from "./TextElement";

interface ElementFactoryProps {
  element: StringBuilderElement;
}
/**
 * The ElementFactory component
 * @param {ElementFactoryProps} props
 * @return {ReactElement}
 */
const ElementFactory = ({ element }: ElementFactoryProps): JSX.Element => {
  switch (element.type) {
    case "TEXT":
      return <TextElement />;

    default:
      break;
  }
  return <div>ElementFactory</div>;
};

export default ElementFactory;
