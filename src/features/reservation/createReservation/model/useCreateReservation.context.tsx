import { createContext, useContext, useState } from "react";
import { ReservationForm } from "../../model/type";
import { parseReservationCreateRequestBody } from "../lib/parseReservationCreateRequestBody";
import { useCreateReservationRequest } from "../api/createReservationApi";
import { ReservationStackParamList } from "@hongpung/nav/ReservationStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

interface CreateReservationContextProps {
    reservation: Partial<ReservationForm>;

    setDate: (date: ReservationForm['date']) => void;
    setStartTime: (time: ReservationForm['startTime']) => void;
    setEndTime: (time: ReservationForm['endTime']) => void;
    setTitle: (time: ReservationForm['title']) => void;
    setParticipators: (participators: ReservationForm['participators']) => void;
    setInstruments: (borrowInstruments: ReservationForm['borrowInstruments']) => void;
    setParticipationAvailable: (participationAvailable: ReservationForm['participationAvailable']) => void;
    setReservationType: (reservationType: ReservationForm['reservationType']) => void;

    isValidReservation: boolean;
    requestCreateReservation: () => Promise<void>;
}

const CreateReservationContext = createContext<CreateReservationContextProps | undefined>(undefined);

type CreateReservationNavProps = NativeStackNavigationProp<ReservationStackParamList, 'ReservationStack'>

const CreateReservationContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [reservation, setReservationState] = useState<ReservationForm>({
        title: "",
        reservationType: "REGULAR",
        participationAvailable: false,
        borrowInstruments: [],
        participators: [],
    });

    const isCompleteReservation = (reservation: ReservationForm): reservation is Required<ReservationForm> => {
        return Object.values(reservation).every(value => value !== null);
    };

    const navigation = useNavigation<CreateReservationNavProps>();

    const { request } = useCreateReservationRequest();

    // setReservation을 업데이트 함수로 개선
    const setReservation = (update: Partial<ReservationForm>) => {
        setReservationState((prev) => ({
            ...prev,
            ...update,
        }));
    };

    // 개별 Setter 함수 추가
    const setDate = (date: ReservationForm['date']) => setReservation({ date });
    const setStartTime = (startTime: ReservationForm['startTime']) => setReservation({ startTime });
    const setEndTime = (endTime: ReservationForm['endTime']) => setReservation({ endTime });
    const setTitle = (title: ReservationForm['title']) => setReservation({ title });
    const setParticipators = (participators: ReservationForm['participators']) => setReservation({ participators });
    const setInstruments = (borrowInstruments: ReservationForm['borrowInstruments']) => setReservation({ borrowInstruments });
    const setParticipationAvailable = (participationAvailable: ReservationForm['participationAvailable']) => setReservation({ participationAvailable });
    const setReservationType = (reservationType: ReservationForm['reservationType']) => setReservation({ reservationType });

    const isValidReservation = isCompleteReservation(reservation)

    // 예약 생성 API 요청 함수 (더미 함수로 예시)
    const requestCreateReservation = async () => {
        try {
            if (!isValidReservation) throw Error('예약을 완벽히 작성해주세요.');

            const { reservationId } = await request(parseReservationCreateRequestBody(reservation));

            navigation.navigate('ReservationDetail', { reservationId })
            console.log("예약 생성 요청:", reservation);
            // 실제 API 요청을 추가할 것
        } catch (error) {
            console.error("예약 생성 중 오류 발생:", error);
        }
    };

    return (
        <CreateReservationContext.Provider
            value={{
                reservation,

                setDate,
                setStartTime,
                setEndTime,
                setTitle,
                setParticipators,
                setInstruments,
                setParticipationAvailable,
                setReservationType,

                isValidReservation,
                requestCreateReservation,
            }}
        >
            {children}
        </CreateReservationContext.Provider>
    );
};

// Context 사용을 위한 커스텀 훅
const useCreateReservation = () => {
    const context = useContext(CreateReservationContext);
    if (!context) {
        throw new Error("useCreateReservation must be used within a CreateReservationContextProvider");
    }
    return context;
};

export { CreateReservationContextProvider, useCreateReservation };