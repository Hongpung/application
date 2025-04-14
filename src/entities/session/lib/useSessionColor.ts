import { useMemo } from 'react';
import { SessionLog } from '@hongpung/src/entities/session';

interface UseSessionColorProps {
  sessionLogList: Record<string, SessionLog[]> | null;
}

export const useSessionColor = ({ sessionLogList }: UseSessionColorProps) => {
  if (!sessionLogList) {
    return {};
  }
  return useMemo(() => {
    return Object.entries(sessionLogList).reduce((acc, [date, logList]) => {
      const day = new Date(date).getDate();
      if (!acc[day]) {
        acc[day] = [];
      }
      logList.forEach((log) => {
        let color: string;
        if (log.sessionType === 'RESERVED' && log.reservationType === 'REGULAR') {
          color = 'blue';
        } else if (log.participationAvailable) {
          color = 'green';
        } else {
          color = 'red';
        }

        acc[day].push(color);
      });
      return acc;
    }, {} as { [date: number]: string[] });
  }, [sessionLogList]);
}; 