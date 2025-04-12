import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ReservationForm } from "../../model/type";
import { TimeFormat } from "@hongpung/src/common";
import { isEqual } from "lodash";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ReservationStackParamList } from "@hongpung/nav/ReservationStack";
import { useEditReservationRequest } from "../api/editReservationApi";
import { getReservationEditRequestBody } from "@hongpung/src/entities/reservation";

interface EditReservationContextProps {

    prevReservation: ReservationForm & { reservationId: number };
    reservation: ReservationForm & { reservationId: number };

    setDate: (date: ReservationForm['date']) => void;
    setStartTime: (time: ReservationForm['startTime']) => void;
    setEndTime: (time: ReservationForm['endTime']) => void;

    setTitle: (time: ReservationForm['title']) => void;

    setParticipationAvailable: (participationAvailable: ReservationForm['participationAvailable']) => void;
    setReservationType: (reservationType: ReservationForm['reservationType']) => void;

    setParticipators: (participators: ReservationForm['participators']) => void;
    setBorrowInstruments: (borrowInstruments: ReservationForm['borrowInstruments']) => void;

    verifyEditReservation: (onVerfyied: () => void) => Promise<void>;
    differentKeys: (keyof ReservationForm)[]

    requestEditReservation: () => Promise<void>;

    isLoading: boolean;

}

const EditReservationContext = createContext<EditReservationContextProps | undefined>(undefined);


type EditReservationNavProps = NativeStackNavigationProp<ReservationStackParamList, 'ReservationStack'>


const EditReservationContextProvider = ({ prevReservation, children }: { prevReservation: ReservationForm & { reservationId: number }; children: React.ReactNode }) => {

    const navigation = useNavigation<EditReservationNavProps>();

    const [reservation, setReservationState] = useState<ReservationForm & { reservationId: number }>(prevReservation);

    const { request, isLoading, error } = useEditReservationRequest()

    // setReservation을 업데이트 함수로 개선
    const setReservation = (update: Partial<ReservationForm>) => {
        setReservationState((prev) => ({
            ...prev,
            ...update,
        }));
    };

    // 각 필드에 대한 setter들을 묶어서 반환
    const setters = useMemo(() => ({
        setDate: (date: ReservationForm['date']) => setReservation({ date }),
        setStartTime: (startTime: ReservationForm['startTime']) => setReservation({ startTime }),
        setEndTime: (endTime: ReservationForm['endTime']) => setReservation({ endTime }),
        setTitle: (title: ReservationForm['title']) => setReservation({ title }),
        setParticipators: (participators: ReservationForm['participators']) => setReservation({ participators }),
        setBorrowInstruments: (borrowInstruments: ReservationForm['borrowInstruments']) => setReservation({ borrowInstruments }),
        setParticipationAvailable: (available: ReservationForm['participationAvailable']) => setReservation({ participationAvailable: available }),
        setReservationType: (type: ReservationForm['reservationType']) => setReservation({ reservationType: type }),
    }), [setReservation]);

    // 예약 생성 API 요청 함수 (더미 함수로 예시)
    const verifyEditReservation = useCallback(async (onVerfyied: () => void) => {
        if (isEqual(prevReservation, reservation)) {
            Alert.alert(
                '예약 오류', // 타이틀
                "기존 예약과 동일합니다."
            );
        } else {
            onVerfyied()
        }
    }, [reservation]);

    const differenceKey = useMemo(() => {
        if (!reservation) return [];

        if (!prevReservation) return []; // 초기 상태면 전체 반환

        const diff: (keyof ReservationForm)[] = [];

        for (const key of Object.keys(reservation) as (keyof ReservationForm)[]) {
            if (reservation[key] !== prevReservation[key]) {
                diff.push(key);
            }
        }

        return diff;
    }, [reservation])

    const requestEditReservation = async () => {
        try {
            if (isEqual(prevReservation, reservation)) throw new Error("기존 예약과 동일합니다.");

            await request(getReservationEditRequestBody(prevReservation, reservation));

            navigation.navigate('ReservationDetail', { reservationId: prevReservation.reservationId })

        } catch (e) {

            if (e instanceof Error) {

                Alert.alert('예약 오류', e.message);
                console.error("예약 수정 중 오류 발생:", e.message);

            }
            else if (error instanceof Error) {

                Alert.alert('예약 오류', error?.message || "예약 수정 중 오류가 발생했습니다.");
                console.error("예약 수정 중 오류 발생:", error);

            } else {
                Alert.alert('예약 오류', "예약 수정 중 오류가 발생했습니다.");
                console.error("예약 수정 중 오류 발생:", error);
            }

        }

    };

    return (
        <EditReservationContext.Provider
            value={{
                prevReservation,
                reservation,
                differentKeys: differenceKey,
                ...setters,

                isLoading,
                verifyEditReservation,
                requestEditReservation,
            }}
        >
            {children}
        </EditReservationContext.Provider>
    );
};

// Context 사용을 위한 커스텀 훅
const useEditReservation = () => {
    const context = useContext(EditReservationContext);
    if (!context) {
        throw new Error("useCreateReservation must be used within a CreateReservationContextProvider");
    }
    return context;
};

export { EditReservationContextProvider, useEditReservation };