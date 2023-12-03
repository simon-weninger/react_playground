import * as RadixContextMenu from "@radix-ui/react-context-menu";

interface ContextMenuItemProps {
  label: string;
  description?: string;
  onClick?: () => void;
  icon?: any;
}
/**
 * The ContextMenuItem component
 * @param {ContextMenuItemProps} props
 * @return {ReactElement}
 */
const ContextMenuItem = ({ label, description, onClick, icon: Icon }: ContextMenuItemProps): JSX.Element => {
  return (
    <RadixContextMenu.Item
      onClick={onClick}
      className="group text-[13px] leading-none text-slate-800 rounded-[3px] flex items-center h-[25px] px-[5px] relative select-none outline-none data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-slate-700 data-[highlighted]:text-slate-50"
    >
      {Icon && <Icon className="h-4 mr-1" />}
      {label}
      <div className="ml-auto pl-5 text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-gray-300">
        {description}
      </div>
    </RadixContextMenu.Item>
  );
};

export default ContextMenuItem;
