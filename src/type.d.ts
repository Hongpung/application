declare global {
    type IsAny<T> = 0 extends (1 & T) ? true : false;

    type ReservationType = "REGULAR" | "COMMON" | "EXTERNAL";

    type SessionType = 'REALTIME' | 'RESERVED';
    
    type ClubName = '들녘' | '산틀' | '신명화랑' | '악반' | '기타'

    type InstrumentType = '꽹과리' | '장구' | '북' | '소고' | '징' | '기타';

}

export { }; // 글로벌 타입 선언을 위해 필요