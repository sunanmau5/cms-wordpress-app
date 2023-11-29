"use client";

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type HoverContextProps = {
  activeOption: string | null;
  setActiveOption: Dispatch<SetStateAction<string | null>>;
};

const HoverContext = createContext({} as HoverContextProps);

interface Props {
  initialActiveOption: string;
  children: React.ReactNode;
}

export const HoverProvider: React.FC<Props> = ({
  initialActiveOption,
  children,
}) => {
  const [activeOption, setActiveOption] = useState<string>(initialActiveOption);

  return (
    <HoverContext.Provider value={{ activeOption, setActiveOption }}>
      {children}
    </HoverContext.Provider>
  );
};

export const useHoverContext = () => {
  const context = useContext(HoverContext);
  if (
    context === undefined ||
    (typeof context === "object" && Object.keys(context).length === 0)
  ) {
    throw new Error("useHoverContext must be used within a HoverProvider");
  }

  return context;
};
