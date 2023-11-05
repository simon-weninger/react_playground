import SearchBarInput from "@src/string-builder/components/SearchBarInput";
import React, { useState, useEffect, useRef, KeyboardEvent, forwardRef } from "react";

interface SearchSelectProps<T extends { key: string }> {
  data: T[];
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  filterFunction: (item: T, query: string) => boolean;
}

function SearchSelect<T extends { key: string }>(
  { data, renderItem, onSelect, filterFunction }: SearchSelectProps<T>,
  ref: React.Ref<HTMLInputElement> | undefined
) {
  const [filterValue, setFilterValue] = useState("");

  const filteredData = data.filter((item) => filterFunction(item, filterValue));
  return (
    <div className="flex flex-col gap-2">
      <SearchBarInput ref={ref} type="text" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
      {filteredData.map((item) => (
        <button
          className="full-w"
          tabIndex={-1}
          onClick={() => {
            onSelect(item);
          }}
        >
          {renderItem(item)}
        </button>
      ))}
    </div>
  );
}

const SearchSelectRef = forwardRef(SearchSelect) as <T extends { key: string }>(
  props: SearchSelectProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof SearchSelect>;

// const SearchSelect = <T extends { key: string }>({ data, onSelect, renderItem }: SearchSelectProps<T>) => {
//   const [query, setQuery] = useState("");
//   const [filteredData, setFilteredData] = useState<T[]>([]);
//   const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const listRef = useRef<HTMLUListElement | null>(null);

//   useEffect(() => {
//     const filtered = data.filter((item) => item.key.toLowerCase().includes(query.toLowerCase()));
//     setFilteredData(filtered);
//   }, [data, query]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setQuery(e.target.value);
//     setFocusedIndex(null); // Clear the focus when input changes
//   };

//   const handleSelectItem = (item: T) => {
//     if (onSelect) {
//       onSelect(item);
//     }
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
//     if (e.key === "Enter" && focusedIndex !== null) {
//       e.preventDefault();
//       handleSelectItem(filteredData[focusedIndex]);
//     } else if (e.key === "ArrowDown") {
//       e.preventDefault();
//       if (focusedIndex === null || focusedIndex === filteredData.length - 1) {
//         setFocusedIndex(0);
//       } else {
//         setFocusedIndex(focusedIndex + 1);
//       }
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       if (focusedIndex === null || focusedIndex === 0) {
//         setFocusedIndex(filteredData.length - 1);
//       } else {
//         setFocusedIndex(focusedIndex - 1);
//       }
//     } else if (e.key === "Tab") {
//       if (focusedIndex !== null) {
//         inputRef.current?.focus();
//         setFocusedIndex(null);
//       }
//     }
//   };

//   return (
//     <div>
//       <SearchBarInput ref={inputRef} type="text" value={query} onChange={handleInputChange} tabIndex={0} />
//       <ul ref={listRef}>
//         {filteredData.map((item, index) => (
//           <button
//             key={item.key}
//             onClick={() => handleSelectItem(item)}
//             className="outline-none w-full"
//             tabIndex={0}
//             onFocus={() => setFocusedIndex(index)}
//             onBlur={() => setFocusedIndex(null)}
//             onKeyDown={(e) => handleKeyDown(e)}
//           >
//             {renderItem(item, index === focusedIndex)}
//           </button>
//         ))}
//       </ul>
//     </div>
//   );
// };
export default SearchSelectRef;
