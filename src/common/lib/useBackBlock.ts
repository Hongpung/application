import { useCallback, useEffect } from "react";
import { BackHandler } from "react-native";
import { Alert } from "@hongpung/src/common";
import { useNavigation } from "@react-navigation/native";

interface BackBlockOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: "red" | "blue" | "green";
  cancelButtonColor?: "red" | "blue" | "green";
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const useBackBlock = (
  onBackPress: () => void,
  options?: BackBlockOptions
) => {
  const {
    title = "확인",
    message = "작업을 취소하고 뒤로 돌아갈까요?",
    confirmText = "네",
    cancelText = "아니오",
    confirmButtonColor = "blue",
    cancelButtonColor = "blue",
    onConfirm,
    onCancel,
  } = options || {};

  const navigation = useNavigation();

  const handleBackPress = useCallback(() => {
    Alert.confirm(title, message, {
      cancelText,
      confirmText,
      cancelButtonColor,
      confirmButtonColor,
      onConfirm: () => {
        onConfirm?.();
        onBackPress();
      },
      onCancel,
    });
  }, [
    title,
    message,
    confirmText,
    cancelText,
    confirmButtonColor,
    cancelButtonColor,
    onConfirm,
    onCancel,
    onBackPress,
  ]);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBackPress();
        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, [handleBackPress]);

  return { handleBackPress };
};
