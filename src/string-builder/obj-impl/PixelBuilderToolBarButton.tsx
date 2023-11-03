import { Tooltip } from "react-tooltip";
import { generateId } from "../utils";

interface PixelBuilderToolBarButtonProps {
  icon: JSX.Element;
  disabled: boolean;
  onClick: () => void;
  toolTip?: string;
}
/**
 * The PixelBuilderToolBarButton component
 * @param {PixelBuilderToolBarButtonProps} props
 * @return {ReactElement}
 */
const PixelBuilderToolBarButton = ({
  icon,
  disabled,
  onClick,
  toolTip,
}: PixelBuilderToolBarButtonProps): JSX.Element => {
  const buttonCSS = disabled ? "text-gray-300" : "text-gray-600 hover:bg-gray-100";

  const tooltipId = generateId();
  return (
    <div data-tooltip-id={tooltipId} data-tooltip-content={toolTip}>
      <Tooltip id={tooltipId} place="bottom" className="z-50" delayShow={1000} />
      <button className={`flex items-center justify-center w-8 h-8 rounded  text-xs ${buttonCSS}`} onClick={onClick}>
        {icon}
      </button>
    </div>
  );
};

export default PixelBuilderToolBarButton;
