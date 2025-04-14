import { StyleSheet, View, Image } from "react-native";
import React, { useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import PagerView from "react-native-pager-view";
import { Color } from "@hongpung/ColorSet";
import { RootStackParamList } from "@hongpung/pageTypes";
import { LongButton, ShortButton } from "@hongpung/src/common";
import { PageIndicator } from "@hongpung/src/common/ui/PageIndicator";
import ImagePage from "@hongpung/src/common/ui/ImagePage/ImagePage";

type TutorialProp = NativeStackNavigationProp<RootStackParamList, "Tutorial">;

const TutorialScreen: React.FC = () => {
  const navigation = useNavigation<TutorialProp>();
  
  const [pageNum, setPageNum] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const nextPage = () => {
    if (pagerRef.current) {
      pagerRef.current.setPage(pageNum + 1);
    }
  };

  const onSkip = () => {
    navigation.replace("Permission");
  };


  return (
    <View style={styles.basicBackground}>
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        ref={pagerRef}
        onPageScroll={(e) => setPageNum(e.nativeEvent.position)}
      >
        <ImagePage key={'page-1'} imageSource={require("@hongpung/assets/images/tutorial/Tutorial-1.png")} />
        <ImagePage key={'page-2'} imageSource={require("@hongpung/assets/images/tutorial/Tutorial-2.png")} />
        <ImagePage key={'page-3'} imageSource={require("@hongpung/assets/images/tutorial/Tutorial-3.png")} />
        <ImagePage key={'page-4'} imageSource={require("@hongpung/assets/images/tutorial/Tutorial-4.png")} />
      </PagerView>
      <View style={styles.footerContainer}>
        <PageIndicator currentPage={pageNum} totalPages={4} />
        <View style={styles.CTA}>
          {pageNum < 3 ? (
            <View style={styles.buttonContainer}>
              <ShortButton
                innerContent={"건너뛰기"}
                isFilled={true}
                color={"blue"}
                onPress={onSkip}
              />
              <ShortButton
                innerContent={"다음"}
                isFilled={false}
                color={"blue"}
                onPress={nextPage}
              />
            </View>
          ) : (
            <LongButton
              innerContent={"이해했어요"}
              isAble={true}
              color={"blue"}
              onPress={onSkip}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  basicBackground: {
    flex: 1,
    backgroundColor: "#fff",
  },
  footerContainer: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 24,
    paddingBottom: 12,
  },
  CTA: {
    flexDirection: "row",
    paddingHorizontal: 32,
    width: "100%",
    justifyContent: "space-around",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    gap: 24,
  },
});

export default TutorialScreen;
