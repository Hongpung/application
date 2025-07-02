import { useEffect, useState } from "react";
import { Member } from "../../member";
import { SessionLog } from "@hongpung/src/entities/session-log";

export const useAttendanceData = (sessionData: SessionLog | null) => {
  const [attendanceList, setAttendanceList] = useState<
    Record<string, Member[]>
  >({});

  useEffect(() => {
    if (!sessionData?.attendanceList) {
      setAttendanceList({});
      return;
    }

    const sortedList: Record<string, Member[]> = {};

    sessionData.attendanceList.forEach((attendanceData) => {
      const status = attendanceData.status;
      if (!sortedList[status]) {
        sortedList[status] = [];
      }
      sortedList[status].push(attendanceData.user);
    });

    setAttendanceList(sortedList);
  }, [sessionData]);

  return { attendanceList };
};
