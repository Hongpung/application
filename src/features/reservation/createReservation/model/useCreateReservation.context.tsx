import { createContext } from "react";
import { ReservationForm } from "../../model/type";

interface CreateReservationContextProps{
    reservation:ReservationForm;
    setReservation:(reservation:ReservationForm)=>void;
    setDate:(date:string)=>void; // 날짜 설정 함수 추가

    setStartTime:(time:string)=>void; // 예약 시간 설정 함수 추가
    setEndTime:(time:string)=>void; // 예약 종료 시간 설정 함수 추가

    setTitle:(title:string)=>void; // 제목 설정 함수 추가

    requestCreateReservation: () => Promise<void>; // 예약 생성 요청 함수 추가

}

const CreateReservationContext = createContext<CreateReservationContextProps | undefined>(undefined)