import dayjs from "dayjs";

import { SessionLog } from "@hongpung/src/entities/session-log";

interface UseSessionColorProps {
  sessionLogList?: Record<string, SessionLog[]> | null;
}

export const useSessionColor = ({ sessionLogList }: UseSessionColorProps) => {
  if (!sessionLogList) {
    return {};
  }

  return Object.entries(sessionLogList).reduce(
    (acc, [date, logList]) => {
      const day = dayjs(date).date();
      if (!acc[day]) {
        acc[day] = [];
      }
      logList.forEach((log) => {
        let color: string;
        if (
          log.sessionType === "RESERVED" &&
          log.reservationType === "REGULAR"
        ) {
          color = "blue";
        } else if (log.participationAvailable) {
          color = "green";
        } else {
          color = "red";
        }

        acc[day].push(color);
      });
      return acc;
    },
    {} as { [date: number]: string[] },
  );
};
