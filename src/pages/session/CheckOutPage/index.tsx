import React from "react";
import { StyleSheet, View } from "react-native";
import { ErrorModal } from "@hongpung/src/common";
import { StackActions, useNavigation } from "@react-navigation/native";
import { Header } from "@hongpung/src/common/ui/Header/Header";
import { CheckOutConfirmWidget } from "@hongpung/src/widgets/session/ui/CheckOutConfirmWidget";
import { CheckOutDescriptionWidget } from "@hongpung/src/widgets/session/ui/CheckOutDescriptionWidget";
import { CheckOutCameraWidget } from "@hongpung/src/widgets/session/ui/CheckOutCameraWidget";
import { CheckOutConfirmPhotosWidget } from "@hongpung/src/widgets/session/ui/CheckOutConfirmPhotosWidget";
import { CheckOutCompleteWidget } from "@hongpung/src/widgets/session/ui/CheckOutCompleteWidget";
import { useCheckOut } from "@hongpung/src/features/session/checkOutRoom/model/useCheckOut";
import { UserStatusState } from "@hongpung/src/entities/member";
import { useRecoilValue } from "recoil";
import { Session } from "@hongpung/src/entities/session";
import { PhotoFileFormat } from "@hongpung/src/common/types/PhotoFileFormat";

type CheckOutStep = "CheckOutConfirm" | "CheckOutDescription" | "Camera" | "ConfirmPhotos" | "CheckOutComplete";

interface CheckOutStepProps {
  session: Session;
  photos: PhotoFileFormat[];
  setPhotos: React.Dispatch<PhotoFileFormat[]>;
  onNext: () => void;
  onEnd: () => void;
  isLoading: boolean;
  onHome: () => void;
}

const CheckOutScreen: React.FC = () => {
  const navigation = useNavigation();
  const loginUser = useRecoilValue(UserStatusState);
  const checkOutState = useCheckOut();

  if (!checkOutState) {
    return (
      <ErrorModal
        visible={true}
        title="오류"
        message="체크아웃 상태를 불러올 수 없습니다."
        onConfirm={() => navigation.dispatch(StackActions.popToTop())}
      />
    );
  }

  const {
    isLoading,
    endSession,
    onStep,
    setStep,
    photos,
    setPhotos,
    usingSession,
  } = checkOutState;

  if (!loginUser || !usingSession) {
    return (
      <ErrorModal
        visible={true}
        title="오류"
        message="세션 정보가 존재하지 않습니다. 확인 후 다시 시도해주세요."
        onConfirm={() => navigation.dispatch(StackActions.popToTop())}
      />
    );
  }

  const handleLeftAction = () => {
    if (confirm("이용 종료를 취소하시겠습니까?")) {
      navigation.dispatch(StackActions.popToTop());
    }
  };

  const getHeaderName = (step: CheckOutStep): string | undefined => {
    const headerNames: Record<CheckOutStep, string | undefined> = {
      CheckOutConfirm: undefined,
      CheckOutDescription: undefined,
      Camera: "촬영하기",
      ConfirmPhotos: "사진 확인",
      CheckOutComplete: undefined,
    };
    return headerNames[step];
  };

  const getRightButton = (step: CheckOutStep): string | undefined => {
    return step === "ConfirmPhotos" ? "보내기" : undefined;
  };

  const getRightAction = (step: CheckOutStep): (() => void) | undefined => {
    return step === "ConfirmPhotos" ? endSession : undefined;
  };

  const getNextStep = (currentStep: CheckOutStep): CheckOutStep => {
    const stepOrder: CheckOutStep[] = [
      "CheckOutConfirm",
      "CheckOutDescription",
      "Camera",
      "ConfirmPhotos",
      "CheckOutComplete",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    return stepOrder[currentIndex + 1];
  };

  const renderStep = (step: CheckOutStep) => {
    const stepProps: CheckOutStepProps = {
      session: usingSession,
      photos,
      setPhotos,
      onNext: () => setStep(getNextStep(step)),
      onEnd: endSession,
      isLoading,
      onHome: () => navigation.dispatch(StackActions.replace("HomeStack")),
    };

    const stepComponents: Record<CheckOutStep, React.ReactNode> = {
      CheckOutConfirm: <CheckOutConfirmWidget {...stepProps} />,
      CheckOutDescription: <CheckOutDescriptionWidget {...stepProps} />,
      Camera: <CheckOutCameraWidget {...stepProps} />,
      ConfirmPhotos: <CheckOutConfirmPhotosWidget {...stepProps} />,
      CheckOutComplete: <CheckOutCompleteWidget {...stepProps} />,
    };

    return stepComponents[step];
  };

  return (
    <View style={styles.container}>
      <Header
        HeaderName={getHeaderName(onStep)}
        leftButton="close"
        leftAction={handleLeftAction}
        RightButton={getRightButton(onStep)}
        RightAction={getRightAction(onStep)}
      />
      {renderStep(onStep)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CheckOutScreen;
