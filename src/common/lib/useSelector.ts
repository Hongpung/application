import { useState } from "react";

export const useSelector = () => {
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const closeSelector = () => {
    if (isSelectorOpen) setSelectorOpen(false);
  };

  return [isSelectorOpen, setSelectorOpen, closeSelector] as const;
};
