import { createContext, useContext, useMemo, useState } from "react";
import { ReservationForm } from "../../model/type";
import { parseReservationCreateRequestBody } from "../lib/parseReservationCreateRequestBody";
import { useCreateReservationRequest } from "../api/createReservationApi";
import { ReservationStackParamList } from "@hongpung/nav/ReservationStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

interface CreateReservationContextProps {

    reservation: ReservationForm;

    setDate: (date: ReservationForm['date']) => void;
    setStartTime: (time: ReservationForm['startTime']) => void;
    setEndTime: (time: ReservationForm['endTime']) => void;

    setTitle: (time: ReservationForm['title']) => void;

    setParticipationAvailable: (participationAvailable: ReservationForm['participationAvailable']) => void;
    setReservationType: (reservationType: ReservationForm['reservationType']) => void;

    setParticipators: (participators: ReservationForm['participators']) => void;
    setBorrowInstruments: (borrowInstruments: ReservationForm['borrowInstruments']) => void;

    isValidReservation: boolean;
    requestCreateReservation: () => Promise<void>;

    isLoading: boolean;
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

    const { request, error, isLoading } = useCreateReservationRequest();

    // setReservation을 업데이트 함수로 개선
    const setReservation = (update: Partial<ReservationForm>) => {
        setReservationState((prev) => ({
            ...prev,
            ...update,
        }));
    };

    // 각 필드에 대한 setter들을 묶어서 반환
    const setters = useMemo(() => ({
        setDate: (date: ReservationForm['date']) => setReservation({ date, startTime: undefined, endTime: undefined }),
        setStartTime: (startTime: ReservationForm['startTime']) => setReservation({ startTime }),
        setEndTime: (endTime: ReservationForm['endTime']) => setReservation({ endTime }),
        setTitle: (title: ReservationForm['title']) => setReservation({ title }),
        setParticipators: (participators: ReservationForm['participators']) => setReservation({ participators }),
        setBorrowInstruments: (borrowInstruments: ReservationForm['borrowInstruments']) => setReservation({ borrowInstruments }),
        setParticipationAvailable: (available: ReservationForm['participationAvailable']) => setReservation({ participationAvailable: available }),
        setReservationType: (type: ReservationForm['reservationType']) => setReservation({ reservationType: type }),
    }), [setReservation]);

    const isValidReservation = isCompleteReservation(reservation)

    // 예약 생성 API 요청 함수 (더미 함수로 예시)
    const requestCreateReservation = async () => {
        try {
            if (!isValidReservation) throw Error('예약을 완벽히 작성해주세요.');

            const { reservationId } = await request(parseReservationCreateRequestBody(reservation));

            navigation.navigate('ReservationDetail', { reservationId })
            console.log("예약 생성 요청:", reservation);
            // 실제 API 요청을 추가할 것
        } catch (e) {

            if (error instanceof Error) {
                Alert.alert(
                    '예약 오류', // 타이틀
                    error.message
                )
                console.error("예약 생성 중 오류 발생:", error.message);
            }
            if (e instanceof Error) {
                Alert.alert(
                    '예약 오류', // 타이틀
                    e.message
                )
                console.error("예약 생성 중 오류 발생:", e.message);
            } else {
                Alert.alert(
                    '예약 오류', // 타이틀
                    '예약 생성 중 오류가 발생했어요.'
                )
            }
        }
    };

    return (
        <CreateReservationContext.Provider
            value={{
                reservation,

                ...setters,

                isValidReservation,
                requestCreateReservation,
                isLoading
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