import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type DialogContext = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const DialogContext = createContext<DialogContext>({
  open: false,
  setOpen: () => {},
});

export const useDialogContext = () => useContext(DialogContext);

const Provider = ({ children }: { children?: ReactNode }) => {
  const [open, setOpen] = useState(false);

  const contextMemo = useMemo<DialogContext>(
    () => ({
      open,
      setOpen,
    }),
    [open, setOpen]
  );

  return <DialogContext.Provider value={contextMemo}>{children}</DialogContext.Provider>;
};

type TriggerProps = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Trigger = ({ ...spanProps }: TriggerProps) => {
  const { setOpen } = useDialogContext();

  return (
    <span
      {...spanProps}
      className={spanProps.className + " cursor-pointer"}
      onClick={(e) => {
        setOpen(true);
        if (spanProps.onClick) spanProps.onClick(e);
      }}
    >
      {spanProps.children}
    </span>
  );
};

const Content = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const { open, setOpen } = useDialogContext();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <div
      style={{ display: open ? "" : "none" }}
      className="flex items-center justify-center fixed top-0 left-0 z-50 bg-zinc-900/40 w-screen h-screen"
      onClick={(e) => {
        setOpen(false);
      }}
    >
      <div
        {...props}
        className={"p-4 w-8/12 bg-white rounded-lg shadow-lg ring-1 ring-gray-900/10 " + props.className}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

const Root = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <Provider>{children}</Provider>
    </>
  );
};

const Dialog = {
  root: Root,
  content: Content,
  trigger: Trigger,
};

export default Dialog;
