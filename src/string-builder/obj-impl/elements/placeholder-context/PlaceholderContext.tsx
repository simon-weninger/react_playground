import { JentisPlaceholder } from "@src/string-builder/jentis-types";
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { placeholder as placeholderData } from "../../data-mock";
import { PlaceholderTypeIcon } from "../PlaceholderStringBuilderElement";
import SearchSelect from "./SearchSelect";
import Dialog, { useDialogContext } from "@src/string-builder/components/Dialog";

type PlaceholderContext = {
  placeholder: JentisPlaceholder[];
  addPlaceholder: (placeholder: JentisPlaceholder) => void;
  changePlaceholderFunctionRef: MutableRefObject<(e: JentisPlaceholder) => void>;
};

const PlaceholderContext = createContext<PlaceholderContext>({
  placeholder: [],
  addPlaceholder: () => {},
  changePlaceholderFunctionRef: { current: () => {} },
});

export const usePlaceholderContext = () => useContext(PlaceholderContext);

const Provider = ({ children }: { children?: ReactNode }) => {
  const [placeholder, setPlaceholder] = useState(placeholderData);
  const changePlaceholderFunctionRef = useRef<(e: JentisPlaceholder) => void>(() => {});

  const addPlaceholder = (newPlaceholder: JentisPlaceholder) => {
    setPlaceholder((prev) => [...prev, newPlaceholder]);
  };

  const contextMemo = useMemo<PlaceholderContext>(
    () => ({
      placeholder,
      addPlaceholder,
      changePlaceholderFunctionRef,
    }),
    [open, placeholder]
  );

  return <PlaceholderContext.Provider value={contextMemo}>{children}</PlaceholderContext.Provider>;
};

type TriggerProps = {
  changePlaceholderFn: (e: JentisPlaceholder) => void;
} & DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Trigger = ({ changePlaceholderFn, ...spanProps }: TriggerProps) => {
  const { changePlaceholderFunctionRef } = usePlaceholderContext();

  return (
    <Dialog.trigger
      {...spanProps}
      onClick={(e) => {
        changePlaceholderFunctionRef.current = changePlaceholderFn;
        if (spanProps.onClick) spanProps.onClick(e);
      }}
    ></Dialog.trigger>
  );
};

const DialogContent = () => {
  const { placeholder, changePlaceholderFunctionRef } = usePlaceholderContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setOpen, open } = useDialogContext();

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [open]);

  return (
    <Dialog.content className="w-6/12">
      <SearchSelect
        ref={inputRef}
        data={placeholder.map((e) => ({ ...e, key: e.id }))}
        filterFunction={(ph, query) =>
          ph.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
          ph.group.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
          ph.desc.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        }
        onSelect={(item) => {
          changePlaceholderFunctionRef.current(item);
          setOpen(false);
        }}
        renderItem={(item) => (
          <button
            className={`xw-full cursor-pointer rounded p-1 outline-none text-left  text-gray-600 focus:bg-sky-900 focus:text-sky-50 hover:bg-gray-100`}
            key={item.id}
            tabIndex={0}
          >
            <div className="flex items-center gap-4">
              <PlaceholderTypeIcon type={item.type} className="h-5" />
              <span className="">{item.name}</span>
              <span className="ml-6 text-xs">({item.group})</span>
            </div>
            <p className="text-xs ml-8">{item.desc}</p>
          </button>
        )}
      />
    </Dialog.content>
  );
};

const Root = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <Provider>
        <Dialog.root>
          {children}
          <DialogContent />
        </Dialog.root>
      </Provider>
    </>
  );
};

const Placeholder = {
  root: Root,
  trigger: Trigger,
};

export default Placeholder;
