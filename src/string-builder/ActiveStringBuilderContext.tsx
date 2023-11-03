import { createContext, useContext, useState } from "react";

export const ActiveStringBuilderContext = createContext<[string, React.Dispatch<React.SetStateAction<string>>]>([
  "",
  () => {},
]);

export function useActiveStringBuilderId() {
  return useContext(ActiveStringBuilderContext);
}

export function ActiveStringBuilderIdContextProvider({ children }: { children: React.ReactNode }) {
  const context = useState<string>("");

  return <ActiveStringBuilderContext.Provider value={context}>{children}</ActiveStringBuilderContext.Provider>;
}
