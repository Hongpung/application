import { ReservationDto } from "../api/type"
import { ReservationDetail } from "../model/type"

export function mapReservationDetail(dto: ReservationDto): ReservationDetail {
    return {
        reservationId: dto.reservationId,
        title: dto.title,
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        creatorId: dto.creatorId, // creator가 있을 경우 id 매핑
        creatorName: dto.creatorName,
        creatorNickname: dto.creatorNickname,
        reservationType: dto.reservationType,
        participationAvailable: dto.participationAvailable,
        participators: dto.participators?.filter(user => user.memberId != dto.creatorId), // User 타입 유지
        borrowInstruments: dto.borrowInstruments.map(instrument => ({
            ...instrument
        })) // Instrument 타입 유지
    };
}