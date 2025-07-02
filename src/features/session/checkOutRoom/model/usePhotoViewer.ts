import { useState } from "react";
import { PhotoFileFormat } from "@hongpung/src/common/types/PhotoFileFormat";

interface UsePhotoViewerProps {
  photos: PhotoFileFormat[];
}

export const usePhotoViewer = ({ photos }: UsePhotoViewerProps) => {
  const [selectedIndex, setSelectIndex] = useState(0);
  const [indicatorVisible, setIndicatorVisible] = useState(true);

  const handleIndexChange = (index: number) => {
    setSelectIndex(index);
  };

  const toggleIndicator = () => {
    setIndicatorVisible((prev) => !prev);
  };

  return {
    selectedIndex,
    indicatorVisible,
    handleIndexChange,
    toggleIndicator,
  };
};
