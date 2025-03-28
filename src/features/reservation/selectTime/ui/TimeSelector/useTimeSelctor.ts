import { TimeArray, TimeFormat } from "@hongpung/src/common";
import { useCallback, useState } from "react";
import { useRecoilValue } from "recoil";
import { endTimeState, startTimeState } from "../../../model/reservationFormState";

export const useTimeSelctor = (occupiedTimes: TimeFormat[]) => {

    const startTime = useRecoilValue(startTimeState)
    const endTime = useRecoilValue(endTimeState)

    const [selectedTimeBlocks, setTimeBlocks] = useState<TimeFormat[]>(startTime && endTime ? initailTimeBlock(startTime, endTime) : []);

    function initailTimeBlock(startTime: TimeFormat, endTime: TimeFormat): TimeFormat[] {

        const startIndex = TimeArray.indexOf(startTime)
        const endIndex = TimeArray.indexOf(endTime)
        const newTimes = TimeArray.slice(startIndex, endIndex);

        return [...newTimes]
        
    }

    const toggleTime = useCallback((time: TimeFormat) => {
        // selectedTimes를 정렬한 상태로 유지
        //if (selectedTimeBlocks.length == 0) return;
        const lateTimes = selectedTimeBlocks.sort((a, b) => TimeArray.indexOf(a) - TimeArray.indexOf(b)) ?? [];

        const timeIndex = TimeArray.indexOf(time);
        const firstSelectedTimeIndex = TimeArray.indexOf(lateTimes[0]);
        const lastSelectedTimeIndex = TimeArray.indexOf(lateTimes[lateTimes.length - 1]);

        if (!lateTimes.includes(time)) {
            if (lateTimes.length === 0) {
                lateTimes.push(time);
                setTimeBlocks([...lateTimes]);
            } else if (timeIndex === firstSelectedTimeIndex - 1 || timeIndex === lastSelectedTimeIndex + 1) {
                lateTimes.push(time);
                setTimeBlocks([...lateTimes]);
            } else {
                const startIndex = Math.min(timeIndex, firstSelectedTimeIndex);
                const endIndex = Math.max(timeIndex, lastSelectedTimeIndex);
                const newTimes = TimeArray.slice(startIndex, endIndex + 1);
                const contaionOccupies = newTimes.filter(newTime => occupiedTimes.includes(newTime))

                if (contaionOccupies.length > 0 && contaionOccupies) {
                    if (firstSelectedTimeIndex != startIndex) {
                        //시작점을 바꿀 경우 이미 먹힌 시간은 못먹게 해야함
                        //중첩되는 occupideTime을 가져와야함
                        const lastOccupiedIndex = TimeArray.indexOf(contaionOccupies[contaionOccupies.length - 1]) + 1;
                        const newTimes = TimeArray.slice(lastOccupiedIndex, endIndex + 1);
                        setTimeBlocks([...newTimes]);
                    } else if (lastSelectedTimeIndex != endIndex) {
                        const firstOccupiedIndex = TimeArray.indexOf(contaionOccupies[0]!) - 1;
                        const newTimes = TimeArray.slice(startIndex, firstOccupiedIndex + 1);
                        setTimeBlocks([...newTimes]);
                    }
                }
                else
                    setTimeBlocks([...newTimes]);
            }
        } else {
            const index = lateTimes.indexOf(time);
            if (index > -1) {
                if ((index === 0 && timeIndex === firstSelectedTimeIndex) || (index === lateTimes.length - 1 && timeIndex === lastSelectedTimeIndex)) {
                    lateTimes.splice(index, 1);
                    setTimeBlocks([...lateTimes]);
                }
            }
        }
    }, [selectedTimeBlocks]);


    return { toggleTime, selectedTimeBlocks }
}