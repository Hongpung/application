import { todayReservation } from "@hongpung/recoil/authState";
import { getToken } from "@hongpung/utils/TokenHandler";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useRecoilState } from "recoil";

export const useUserReserve = () => {
    const [userReservations, setReservations] = useRecoilState(todayReservation);
    
    const navigation = useNavigation();


    const loadUserReservation = async () => {

        const controller = new AbortController();
        const signal = controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {

            const token = await getToken('token');

            if (!token) throw Error('invalid Token');


            const loadingUserReservations = await fetch(
                `${process.env.BASE_URL}/reservation/todo`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
                    }
                    ,
                    signal
                }
            )

            if (!loadingUserReservations.ok) throw Error('ServerError: ' + loadingUserReservations.status)

            const loadedRservation = await loadingUserReservations.json();

            setReservations(loadedRservation);

        } catch (e) {
            console.error(e);
            // navigation.dispatch(StackActions.replace('Login'))
        } finally {
            clearTimeout(timeoutId);
        }
    };

    return {
        userReservations,
        loadUserReservation
    };
}