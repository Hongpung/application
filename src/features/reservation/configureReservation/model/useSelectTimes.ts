import { useCallback, useEffect, useMemo } from "react";

import { TimeArray, TimeFormat } from "@hongpung/src/common";

export const useSelectTimes = ({
  occupiedTimes,
  startTime,
  endTime,
  selectedTimeBlocks,
  setTimeBlocks,
  date,
}: {
  occupiedTimes: TimeFormat[];
  startTime?: TimeFormat;
  endTime?: TimeFormat;
  selectedTimeBlocks: TimeFormat[];
  setTimeBlocks: (newBlocks: TimeFormat[]) => void;
  date: string;
}) => {
  const initialTimeBlock = useMemo((): TimeFormat[] => {
    if (!startTime || !endTime) return [];

    const startIndex = TimeArray.indexOf(startTime);
    const endIndex = TimeArray.indexOf(endTime);
    const selectedTimes = TimeArray.slice(startIndex, endIndex);

    return [...selectedTimes];
  }, [startTime, endTime]);

  const toggleTimeBlock = useCallback(
    (time: TimeFormat) => {
      const sortedSelectedTimes =
        selectedTimeBlocks.sort(
          (a, b) => TimeArray.indexOf(a) - TimeArray.indexOf(b)
        ) ?? [];

      const timeIndex = TimeArray.indexOf(time);
      const firstSelectedTimeIndex = TimeArray.indexOf(sortedSelectedTimes[0]);
      const lastSelectedTimeIndex = TimeArray.indexOf(
        sortedSelectedTimes[sortedSelectedTimes.length - 1]
      );

      if (!sortedSelectedTimes.includes(time)) {
        if (sortedSelectedTimes.length === 0) {
          sortedSelectedTimes.push(time);
          setTimeBlocks([...sortedSelectedTimes]);
        } else if (
          timeIndex === firstSelectedTimeIndex - 1 ||
          timeIndex === lastSelectedTimeIndex + 1
        ) {
          sortedSelectedTimes.push(time);
          setTimeBlocks([...sortedSelectedTimes]);
        } else {
          const startIndex = Math.min(timeIndex, firstSelectedTimeIndex);
          const endIndex = Math.max(timeIndex, lastSelectedTimeIndex);
          const newTimes = TimeArray.slice(startIndex, endIndex + 1);
          const containingOccupied = newTimes.filter((newTime) =>
            occupiedTimes.includes(newTime)
          );

          if (containingOccupied.length > 0 && containingOccupied) {
            if (firstSelectedTimeIndex !== startIndex) {
              //시작점을 바꿀 경우 이미 먹힌 시간은 못먹게 해야함
              //중첩되는 occupideTime을 가져와야함
              const lastOccupiedIndex =
                TimeArray.indexOf(
                  containingOccupied[containingOccupied.length - 1]
                ) + 1;
              const newTimes = TimeArray.slice(lastOccupiedIndex, endIndex + 1);
              setTimeBlocks([...newTimes]);
            } else if (lastSelectedTimeIndex !== endIndex) {
              const firstOccupiedIndex =
                TimeArray.indexOf(containingOccupied[0]!) - 1;
              const newTimes = TimeArray.slice(
                startIndex,
                firstOccupiedIndex + 1
              );
              setTimeBlocks([...newTimes]);
            }
          } else setTimeBlocks([...newTimes]);
        }
      } else {
        if (timeIndex === firstSelectedTimeIndex ||
            timeIndex === lastSelectedTimeIndex) {
          setTimeBlocks(
            sortedSelectedTimes.filter((selected) => selected !== time)
          );
        }
      }
    },
    [occupiedTimes, selectedTimeBlocks]
  );

  useEffect(() => {
    if (startTime && endTime) setTimeBlocks(initialTimeBlock);
  }, []);

  useEffect(() => {
    setTimeBlocks([]);
  }, [date]);

  return { selectedTimeBlocks, toggleTimeBlock };
};
