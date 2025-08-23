import { useMemo } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

import { Color, Header, FullScreenLoadingModal } from "@hongpung/src/common";
import { useSelector } from "@hongpung/src/common/lib/useSelector";
import { MainStackScreenProps } from "@hongpung/src/common/navigation";
import { debounce } from "lodash";

import {
  CreateInstrumentButton,
  useCreateInstrument,
} from "@hongpung/src/features/instrument/createInstrument";
import {
  InstrumentTypeSelector,
  InstrumentNameInput,
  InstrumentProfileSelector,
} from "@hongpung/src/features/instrument/configureInstrument";

type InstrumentCreateScreenProps = MainStackScreenProps<"CreateInstrument">;

const InstrumentCreateScreen: React.FC<InstrumentCreateScreenProps> = ({
  navigation,
}) => {
  const navigateToInstrumentDetail = useMemo(
    () =>
      debounce(
        (instrumentId: number) => {
          navigation.replace("InstrumentDetail", { instrumentId });
        },
        200,
        {
          leading: true,
          trailing: false,
        },
      ),
    [navigation],
  );

  const {
    createInstrumentRequest,
    getField,
    resetImage,
    pickImageFromAlbum,
    selectedImageUri,
    isLoading,
  } = useCreateInstrument({ navigateToInstrumentDetail });

  const [onSelectType, setSelectTypeVisible, closeInstrumentTypeSelector] =
    useSelector();

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
          <Header LeftButton={"close"} headerName={"악기 생성"} />
          <FullScreenLoadingModal isLoading={isLoading} />

          <ScrollView contentContainerStyle={styles.scrollView} bounces={false}>
            <View style={{ height: 12 }} />

            <InstrumentProfileSelector
              pickImageFromAlbum={pickImageFromAlbum}
              selectedImageUri={selectedImageUri}
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
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <CreateInstrumentButton onPress={createInstrumentRequest} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default InstrumentCreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color["white"],
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollView: {
    alignItems: "center",
    flex: 1,
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
  },
  card: {
    width: 154,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Color["grey200"],
  },
  Row: {
    flexDirection: "row",
    height: 40,
    width: 342,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  RowLeft: {
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 16,
    color: Color["grey400"],
  },
  RowRight: {
    width: 80,
    textAlign: "right",
    fontFamily: "NanumSquareNeo-Regular",
    fontSize: 16,
    color: Color["grey700"],
  },
});
