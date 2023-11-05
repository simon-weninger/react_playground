import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  DetailedHTMLProps,
  ForwardedRef,
  InputHTMLAttributes,
  MutableRefObject,
  forwardRef,
  useEffect,
  useRef,
} from "react";

type SearchBarInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/**
 * The SearchBarInput component
 * @param {SearchBarInputProps} props
 * @return {ReactElement}
 */
const SearchBarInput = forwardRef(function SearchBarInput(
  props: SearchBarInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  let inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div
      className={
        "border rounded border-gray-400 focus-within:border-sky-800 w-full px-2 text-sm focus-within:ring-1 ring-sky-800 flex gap-2 items-center text-gray-600"
      }
    >
      <MagnifyingGlassIcon className="h-4" />
      <input
        {...props}
        ref={(element) => {
          inputRef.current = element;
          if (typeof ref !== "function" && ref) {
            ref.current = element;
          } else {
            return ref;
          }
        }}
        placeholder={props.placeholder || "Search..."}
        className="outline-none w-full py-2 bg-transparent"
      />
    </div>
  );
});

export default SearchBarInput;
