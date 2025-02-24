import { clubIds } from "../@x/club";

export const userApi = {
    loadInvitableUsers: (findOptions: { username: string, club: string[], enrollmentNumberRange: { startNumber?: string, endNumber?: string } }) => {
        const queryParams = new URLSearchParams();

        if (findOptions.username.length > 0) {
            queryParams.append('username', findOptions.username);
        }

        // clubId 배열을 쿼리 스트링에 추가
        if (findOptions.club.length > 0) {
            findOptions.club.forEach(club => {
                queryParams.append('clubId', clubIds[club]!.toString()); // club.id가 문자열이 아닐 경우 변환
            });
        }

        // 최소 학번 추가
        if (findOptions.enrollmentNumberRange.startNumber) {
            queryParams.append('minEnrollmentNumber', findOptions.enrollmentNumberRange.startNumber);
        }

        // 최대 학번 추가
        if (findOptions.enrollmentNumberRange.endNumber) {
            queryParams.append('maxEnrollmentNumber', findOptions.enrollmentNumberRange.endNumber);
        }

        // 최종 URL 생성
        const queryString = queryParams.toString();

        const url = `${process.env.EXPO_PUBLIC_BASE_URL}/member/invite-possible${queryString ? `?${queryString}` : ''}`;
        
        return {
            method: 'GET',
            url
        }
    }
}