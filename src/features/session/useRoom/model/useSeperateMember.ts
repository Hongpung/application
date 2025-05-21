import { Member } from "@hongpung/src/entities/member";
import { Session } from "@hongpung/src/entities/session";
import { useState, useCallback, useEffect } from "react";

export const useSeperateMember = (usingSession: Session | null) => {
  const [attendUsers, setAttendUsers] = useState<Member[]>([]);
  const [lateUsers, setLateUsers] = useState<Member[]>([]);
  const [absentUsers, setAbsentUsers] = useState<Member[]>([]);

  const seperateUser = useCallback(
    (
      sessionAttendanceList: {
        user: Member;
        status: "참가" | "출석" | "결석" | "지각";
      }[]
    ) => {
      const attends: Member[] = [];
      const lates: Member[] = [];
      const absences: Member[] = [];

      sessionAttendanceList?.forEach(({ user, status }) => {
        if (status === "참가" || status === "출석") attends.push(user);
        else if (status === "지각") lates.push(user);
        else if (status === "결석") absences.push(user);
      });

      setAttendUsers(attends);
      setLateUsers(lates);
      setAbsentUsers(absences);
    },
    []
  );

  useEffect(() => {
    if (usingSession) seperateUser(usingSession?.attendanceList);
  }, [usingSession?.attendanceList]);

  console.log("attendUsers", attendUsers);
  console.log("lateUsers", lateUsers);
  console.log("absentUsers", absentUsers);

  return { attendUsers, lateUsers, absentUsers };
};
