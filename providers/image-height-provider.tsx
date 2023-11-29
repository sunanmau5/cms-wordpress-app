"use client";

import React, { createContext, useContext } from "react";

type ImageHeightContextProps = {
  imageHeight: number;
};

const ImageHeightContext = createContext({} as ImageHeightContextProps);

interface Props {
  imageHeight: number;
  children: React.ReactNode;
}

export const ImageHeightProvider: React.FC<Props> = ({
  imageHeight,
  children,
}) => {
  return (
    <ImageHeightContext.Provider value={{ imageHeight }}>
      {children}
    </ImageHeightContext.Provider>
  );
};

export const useImageHeightContext = () => {
  const context = useContext(ImageHeightContext);
  if (
    context === undefined ||
    (typeof context === "object" && Object.keys(context).length === 0)
  ) {
    throw new Error(
      "useImageHeightContext must be used within a ImageHeightProvider",
    );
  }

  return context;
};
