import { RealtimeSession, ReservationSession } from "@hongpung/pages/Reservation/SessionTypes";
import { useOnReserve } from "@hongpung/recoil/authState";
import { onUseSession } from "@hongpung/recoil/sessionState";
import { uploadImageListRequest } from "@hongpung/src/common/api/uploadImageApi";
import { getToken } from "@hongpung/src/common/lib/TokenHandler";
import { StackActions, useNavigation } from "@react-navigation/native";
import { createContext, ReactNode, useContext, useState } from "react";
import { Alert } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";

type CheckOutStep = | 'CheckOutConfirm' | 'Description' | 'Camera' | 'CheckPicture' | 'CheckOutComplete'
type PhotoFileFormat = { uri: string, originHeight: number, originWidth: number }

interface CheckOutContext {
    isLoading: boolean
    onStep: CheckOutStep
    setStep: (newStep: CheckOutStep) => void
    photos: PhotoFileFormat[]
    setPhotos: (photos: PhotoFileFormat[]) => void
    usingSession: ReservationSession | RealtimeSession | null
    endSession: () => void
}

const CheckOutContext = createContext<CheckOutContext | undefined>(undefined);


const CheckOutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const navigation = useNavigation();

    const usingSession = useRecoilValue(onUseSession)
    const [onStep, setStep] = useState<CheckOutStep>('CheckOutConfirm')
    const [isLoading, setLoading] = useState(false)
    const setRoomSocket = useSetRecoilState(useOnReserve)

    const [photos, setPhotos] = useState<PhotoFileFormat[]>([]);

    const endSession = () => {
        const endfetch = async () => {
            try {
                if (!usingSession) throw Error('진행 중인 세션 정보가 없습니다.')

                const token = await getToken('token')

                setStep('CheckOutComplete')

                setLoading(true)

                const photoFiles = photos.map(photo => {

                    const imageUri = photo.uri;
                    const imageName = imageUri.split('/').pop();
                    const imageType = `image/${imageName?.split('.').pop()}`;

                    const imageFile = {
                        uri: imageUri,
                        name: imageName,
                        type: imageType,
                    } as unknown as File;

                    return imageFile
                })

                const data = await uploadImageListRequest(photoFiles, 'end-session');



                const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/session/end`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 Bearer 토큰 추가
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ returnImageUrls: data.imageUrls })
                })

                if (!response.ok) throw Error('Failed')
                const { message } = await response.json();
                console.log(message)

                if (message != 'Fail') {
                    setRoomSocket(false)
                }

            } catch (e) {
                console.log(e)
                if (e instanceof Error) {
                    if (e.message == '진행 중인 세션 정보가 없습니다.') {
                        {
                            alert(e.message)
                            navigation.dispatch(StackActions.replace('HomeStack'))
                        }
                    }
                }
                alert('종료 중 오류가 발생했어요.\n다시 시도해주세요.')
                setStep('CheckPicture')
            }
            finally {
                setLoading(false)
            }
        }
        endfetch()
    }


    if (!usingSession && (onStep != 'CheckOutComplete')) {
        navigation.dispatch(StackActions.replace('HomeStack'))
        Alert.alert('세션 만료', '이미 종료된 세션입니다.');
        return;
    }

    return (
        <CheckOutContext.Provider value={{
            isLoading,
            endSession,
            onStep,
            setStep,
            photos,
            setPhotos,
            usingSession
        }
        }>
            {children}
        </CheckOutContext.Provider>
    );
};

const useCheckOut = () => {

    const context = useContext(CheckOutContext);

    if (context === undefined) {
        throw new Error('useCheckOut must be used within a CheckOutContext');
    }
    return context;

};

export { CheckOutProvider, useCheckOut };
