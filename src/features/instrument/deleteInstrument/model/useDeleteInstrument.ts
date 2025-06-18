import { StackActions, useNavigation } from "@react-navigation/native";
import { useDeleteInstrumentRequest } from "../api/deleteInstrumentApi";
import { Alert } from "@hongpung/src/common";
import { showDeleteInstrumentCompleteToast } from "../constant/toastAction";

export const useDeleteInstrument = () => {
  const navigation = useNavigation();
  const { request, isLoading } = useDeleteInstrumentRequest();

  const handleDelete = async (instrumentId: number) => {
    try {
      await request({ instrumentId });
      showDeleteInstrumentCompleteToast();
      navigation.dispatch(StackActions.replace("InstrumentsHome"));
    } catch (err: unknown) {
      if (err instanceof Error) {
        Alert.alert("오류", "오류가 발생했어요.\n" + `(${err.message})`);
      } else {
        Alert.alert(
          "오류",
          "알수 없는 원인에 의해 실패했어요.\n관리자에게 문의해주세요",
        );
      }
    }
  };

  return {
    handleDelete,
    isLoading,
  };
};
