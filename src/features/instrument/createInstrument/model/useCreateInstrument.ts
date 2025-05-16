import { useEffect, useMemo, useState } from "react"
import { Alert } from "react-native"

import { StackActions, useNavigation } from "@react-navigation/native"

import { parseInstrumentCreateBody } from "../lib/parseInstrumentCreateBody"
import { useCreateInsrumentRequest } from "../api/createInstrumentApi"
import { showCreateInstrumentCompleteToast } from "../constant/toastAction"

import { InstrumentCreateForm } from "./type"

export const useCreateInstrument = (selectedFile: File | null) => {

    const navigation = useNavigation();
    const [createInstrumentData, setCreateInstrumentData] = useState<InstrumentCreateForm>({
        instrumentType: null,
        name: '',
        selectedImage: null
    })

    const { instrumentType } = createInstrumentData

    const setter = useMemo(() => ({
        setName: (name: string) => setCreateInstrumentData(prev => ({ ...prev, name })),
        setInstrumentType: (instrumentType: InstrumentType) => setCreateInstrumentData(prev => ({ ...prev, instrumentType }))
    }), [setCreateInstrumentData]);

    const { request, isLoading } = useCreateInsrumentRequest();

    const createInstrumentRequest = async () => {
        try {
            if (instrumentType === null) {
                Alert.alert('오류', '악기 종류를 선택해주세요.')
                return;
            }
            const submitForm = await parseInstrumentCreateBody(createInstrumentData)
            const response = await request(submitForm)

            const { instrumentId } = response;

            showCreateInstrumentCompleteToast();
            navigation.dispatch(StackActions.replace('InstrumentSpecific', { instrumentId }));

        } catch (err: unknown) {
            if (err instanceof Error) {
                Alert.alert('오류', '오류가 발생했어요.\n' + `(${err.message})`);
            }
            else {
                Alert.alert('오류', '알수 없는 원인에 의해 실패했어요.\n관리자에게 문의해주세요');
            }
        }
    }

    useEffect(() => {

        setCreateInstrumentData(prev => ({ ...prev, selectedImage: selectedFile }))

    }, [selectedFile])



    return { ...createInstrumentData, createInstrumentRequest, ...setter, isLoading }
}