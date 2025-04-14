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

import { Color } from "@hongpung/src/common";

import { FullScreenLoadingModal } from "@hongpung/src/common/ui/LoadingModal/FullScreenLoadingModal";
import { useImagePicker } from "@hongpung/src/common/lib/useImagePicker";
import { InstrumentTypeSelector } from "@hongpung/src/features/instrument/configureInstrument/ui/InstrumentTypeSelector";
import { InstrumentNameInput } from "@hongpung/src/features/instrument/configureInstrument/ui/InstrumentNameInput/InstrumentNameInput";
import { useSelector } from "@hongpung/src/common/lib/useSelector";

import { useEditInstrument } from "@hongpung/src/features/instrument/editInstrument/model/useEditInstrument";
import { useDeleteInstrument } from "@hongpung/src/features/instrument/deleteInstrument/model/useDeleteInstrument";
import { EditInstrumentButton } from "@hongpung/src/features/instrument/editInstrument/ui/EditInstrumentButton/EditInstrumentButton";
import { DeleteInstrumentButton } from "@hongpung/src/features/instrument/deleteInstrument/ui/DeleteInstrumentButton/DeleteInstrumentButton";
import { useRoute } from "@react-navigation/native";
import { Instrument } from "@hongpung/src/entities/instrument";
import { BorrowAvailableSwitch } from "@hongpung/src/features/instrument/configureInstrument/ui/BorrowAvailableSwitch/BorrowAvailableSwitch";
import InstrumentProfileSelector from "@hongpung/src/features/instrument/configureInstrument/ui/InstrumentProfileSelector/InstrumentProfileSelector";

// type InstrumentEditNav = NativeStackNavigationProp<ClubInstrumentStackParamList, 'InstrumentEdit'>

const EditInstrumentPage: React.FC = () => {
  const { instrument: instrumentData } = useRoute().params as {
    instrument: string;
  };
  const initialInstrument = JSON.parse(instrumentData) as Instrument;
  const { pickImageFromAlbum, selectedImage, selectedImageUri } =
    useImagePicker();
  const [onSelectType, setSelectTypeVisible, closeInstrumentTypeSelector] =
    useSelector();

  const {
    instrument,
    setInstrument,
    handleNameChange,
    handleSubmit,
    isLoading: isEditing,
  } = useEditInstrument({ initialInstrument, selectedFile: selectedImage });

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

          <ScrollView contentContainerStyle={styles.scrollView} bounces={false}>
            <View style={{ height: 12 }} />

            <InstrumentProfileSelector
              pickImageFromAlbum={pickImageFromAlbum}
              instrumentImageUrl={instrument.imageUrl}
              selectedImageUri={selectedImageUri}
            />

            <View style={{ height: 28 }} />

            <View style={styles.inputContainer}>
              <InstrumentNameInput
                name={instrument.name}
                setName={handleNameChange}
              />

              <InstrumentTypeSelector
                onSelectType={onSelectType}
                setSelectTypeVisible={setSelectTypeVisible}
                instrumentType={instrument.instrumentType}
                setInstrumentType={(type) =>
                  setInstrument((prev) => ({ ...prev, instrumentType: type }))
                }
              />

              <BorrowAvailableSwitch
                instrument={instrument}
                setInstrument={setInstrument}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <EditInstrumentButton onPress={handleSubmit} />

            <DeleteInstrumentButton
              onPress={() => handleDelete(instrument.instrumentId)}
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
