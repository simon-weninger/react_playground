interface ColorSelectionProps {
  value: string | undefined;
  onChange: (value: string) => void;
  onReset: () => void;
  className?: string;
}
/**
 * The ColorSelection component
 * @param {ColorSelectionProps} props
 * @return {ReactElement}
 */
const ColorSelection = ({ value, onChange, onReset, className }: ColorSelectionProps): JSX.Element => {
  return (
    <div className="flex gap-1 rounded border border-sky-800 p-0.5">
      <div className={"flex flex-1 flex-row rounded " + className} style={{ backgroundColor: value }}>
        <input
          className="flex-1 cursor-pointer"
          type="color"
          onChange={(e) => {
            onChange(e.target.value);
          }}
          value={value}
          style={{ opacity: 0 }}
        />
      </div>
      <button
        className="flex items-center justify-center rounded text-xs p-1 text-sky-800 hover:bg-sky-900 hover:text-sky-50"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
};

export default ColorSelection;
