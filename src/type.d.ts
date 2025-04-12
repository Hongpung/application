import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";


type RootStackParamList = {
    WebView: { url: string, title?: string }
    Tutorial: undefined;
    HomeStack: undefined;
    Permission: undefined;
    Login: undefined;
    SignUp: undefined;
    PWReset: undefined;
};
// 프로젝트 루트 또는 `src/types/` 경로에 배치 가능
type MainStackParamList = {
    Home: undefined;
    WebView: { url: string, title?: string };
    QRScan: undefined;

    BottomTab: undefined;

    Notification: undefined; // Home은 파라미터가 없음
    UsingManage: undefined;
    Banners: undefined;

    CheckIn: undefined; // 예시로 Profile 화면에 userId가 필요하다고 가정    

    MyPage: ScreenParams<MyPageParamList>
    MyClub: ScreenParams<MyClubStackStackParamList>
    Reservation: ScreenParams<ReservationStackParamList>
    CheckOut: undefined

    NoticeStack?: ScreenParams<NoticeStackParamList>;
    // ChatRoomStack?: ScreenParams<ChatStackParamList>;

    ExtraActivities: undefined
};

type InReservationStackParamList = {
    inReservation?: { reservationId: number | null, date: string };

    ResrvationDateSelect: undefined;
    TimeSelect: undefined;
    BorrowInstrumentSelect: undefined;

    ParticipantsSelect: undefined;
    ReservationConfirm: undefined;
    ReservationEditConfirm: undefined;
};

type ReservationStackParamList = {
    ReservationCalendar?: { date?: string };
    DailyReserveList: { date: string }
    ReservationDetail: { reservationId: number }

    ReservationStack?: ScreenParams<InReservationStackParamList>;
    ReservationParticipatorsView: { participators: string }//User[]
    ReservationInstrumentsView: { instruments: string }//User[]
};

type NoticeStackParamList = {
    Notices: undefined;
    NoticeDetail: { noticeId: number }
};

type CheckOutStackParamList = {
    CheckOutStart: undefined;
    CheckOutDescript: undefined;
    CheckOutCamera: undefined;
    PictureCheck: { photos: { uri: string, originHeight: number, originWidth: number }[] };
    CheckOutEnd: undefined;
};

type ClubInstrumentStackParamList = {
    InstrumentsHome: undefined;
    InstrumentSpecific: { instrumentId: number };
    InstrumentCreate: undefined;
    InstrumentEdit: { instrumentInform: string };
};

type BottomTabParamList = {
    Home: undefined;
    Reservation: undefined;
    QRScan: undefined;
    MyPage: undefined;
};

type MyClubStackStackParamList = {
    MyClubHome: undefined;
    ClubMembers: undefined;
    Instruments: ScreenParams<ClubInstrumentStackParamList>
    ClubCalendar: undefined;
    MyClubPracticeInfo: { reservationId: number };
};


declare global {
    type IsAny<T> = 0 extends (1 & T) ? true : false;

    type ReservationType = "REGULAR" | "COMMON" | "EXTERNAL";

    type SessionType = 'REALTIME' | 'RESERVED';
    
    type ScreenParams<StackParamList> = {
        [K in keyof StackParamList]: StackParamList[K] extends undefined
        ? { screen: K }
        : { screen: K; params: StackParamList[K] }
    }[keyof StackParamList];

    type RootStackProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>;

    type MainStackProps<K extends keyof MainStackParamList> = NativeStackScreenProps<MainStackParamList, K>;

    type BottomTabProps<K extends keyof BottomTabParamList> = BottomTabScreenProps<BottomTabParamList, K>;

    type ReservationStackProps<K extends keyof ReservationStackParamList> = NativeStackScreenProps<ReservationStackParamList, K>;

    type ClubName = '들녘' | '산틀' | '신명화랑' | '악반' | '기타'

    const clubNames: ClubName[] = ['들녘', '산틀', '신명화랑', '악반', '기타'] as const
}


export { }; // 글로벌 타입 선언을 위해 필요
