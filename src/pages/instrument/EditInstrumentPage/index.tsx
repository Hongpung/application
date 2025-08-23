import {
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React from "react";

import { Color, Header } from "@hongpung/src/common";

import { FullScreenLoadingModal } from "@hongpung/src/common/ui/LoadingModal/FullScreenLoadingModal";
import { InstrumentTypeSelector } from "@hongpung/src/features/instrument/configureInstrument/ui/InstrumentTypeSelector";
import { InstrumentNameInput } from "@hongpung/src/features/instrument/configureInstrument/ui/InstrumentNameInput/InstrumentNameInput";
import { useSelector } from "@hongpung/src/common/lib/useSelector";

import { useEditInstrument } from "@hongpung/src/features/instrument/editInstrument/model/useEditInstrument";
import { useDeleteInstrument } from "@hongpung/src/features/instrument/deleteInstrument/model/useDeleteInstrument";
import { EditInstrumentButton } from "@hongpung/src/features/instrument/editInstrument/ui/EditInstrumentButton/EditInstrumentButton";
import { DeleteInstrumentButton } from "@hongpung/src/features/instrument/deleteInstrument/ui/DeleteInstrumentButton/DeleteInstrumentButton";

import { Instrument } from "@hongpung/src/entities/instrument";
import { BorrowAvailableSwitch } from "@hongpung/src/features/instrument/configureInstrument/ui/BorrowAvailableSwitch/BorrowAvailableSwitch";
import InstrumentProfileSelector from "@hongpung/src/features/instrument/configureInstrument/ui/InstrumentProfileSelector/InstrumentProfileSelector";
import { MainStackScreenProps } from "@hongpung/src/common/navigation";

type EditInstrumentPageProps = MainStackScreenProps<"EditInstrument">;

const EditInstrumentPage: React.FC<EditInstrumentPageProps> = ({ route }) => {
  const { instrument: instrumentData } = route.params;
  const initialInstrument = JSON.parse(instrumentData) as Instrument;

  const [onSelectType, setSelectTypeVisible, closeInstrumentTypeSelector] =
    useSelector();

  const {
    getField,
    handleSubmit,
    pickImageFromAlbum,

    selectedImageUrl,
    resetImage,
    isLoading: isEditing,
  } = useEditInstrument({ initialInstrument });

  const { handleDelete, isLoading: isDeleting } = useDeleteInstrument();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        closeInstrumentTypeSelector();
      }}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.container}>
          <FullScreenLoadingModal isLoading={isEditing || isDeleting} />
          <Header headerName="악기 수정" LeftButton={"close"} />
          <ScrollView contentContainerStyle={styles.scrollView} bounces={false}>
            <View style={{ height: 12 }} />

            <InstrumentProfileSelector
              pickImageFromAlbum={pickImageFromAlbum}
              selectedImageUri={selectedImageUrl}
              onResetImage={resetImage}
            />

            <View style={{ height: 28 }} />

            <View style={styles.inputContainer}>
              <InstrumentNameInput {...getField("name")} />

              <InstrumentTypeSelector
                onSelectType={onSelectType}
                setSelectTypeVisible={setSelectTypeVisible}
                {...getField("instrumentType")}
              />

              <BorrowAvailableSwitch
                {...getField("borrowAvailable")}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <EditInstrumentButton onPress={handleSubmit} />

            <DeleteInstrumentButton
              onPress={() => handleDelete(getField("instrumentId").value)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollView: {
    alignItems: "center",
    flex: 1,
  },
  spacing: {
    height: 12,
  },
  imageContainer: {
    overflow: "hidden",
    width: 308,
    height: 204,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 308,
    height: 204,
  },
  imagePlaceholder: {
    backgroundColor: Color["grey200"],
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    width: 308,
    height: 204,
    borderRadius: 10,
  },
  imagePlaceholderText: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 14,
    color: Color["grey400"],
  },
  inputContainer: {
    flexDirection: "column",
    gap: 12,
    paddingVertical: 24,
  },
  buttonContainer: {
    paddingVertical: 8,
    gap: 12,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  switchLabel: {
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 16,
    color: Color["grey900"],
  },
});

export default EditInstrumentPage;
