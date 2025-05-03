import { ThisSessionState } from "@hongpung/src/entities/session";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

export const useCalculateTime = () => {

    const usingSession = useAtomValue(ThisSessionState);

    const [remainingHour, setRemainingHour] = useState("00시간");
    const [remainingMinute, setRemainingMinute] = useState("00분");
    
    const [canExtand, setExtendPossible] = useState(true);
    const [canReturn, setcanReturnPossible] = useState(false);

    const calculateTimeDifference = () => {
        if (usingSession) {
            const now = new Date();

            // 목표 시각 생성
            const [endHours, endMinutes] = usingSession?.endTime.split(':').map(Number);
            
            const endDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                endHours,
                endMinutes,
            );

            // 시간 차이 계산
            const diffForExtend = endDate.getTime() - now.getTime();
            if (diffForExtend <= 15 * 60 * 1000) {
                setExtendPossible(false)
            }
            
            const [startHours, startMinutes] = usingSession?.startTime.split(':').map(Number);

            const startDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                startHours,
                startMinutes,
            );

            const diffForReturn = now.getTime() - startDate.getTime()
            if (diffForReturn >= 15 * 60 * 1000) {
                setcanReturnPossible(true)
            }

            const diffHours = Math.floor(diffForExtend / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffForExtend % (1000 * 60 * 60)) / (1000 * 60));
            setRemainingHour(`${String(diffHours).padStart(2, "0")}시간`);
            setRemainingMinute(`${String(diffMinutes).padStart(2, "0")}분`);
        }
    };

    useEffect(() => {
        // 초기 시간 계산
        calculateTimeDifference();

        // 1초마다 시간 업데이트
        const interval = setInterval(calculateTimeDifference, 1000);

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
    }, [usingSession?.endTime]);

    return { remainingHour, remainingMinute, canExtand, canReturn };
}
