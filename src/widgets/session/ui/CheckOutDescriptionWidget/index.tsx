import React, { useState, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import { LongButton } from "@hongpung/src/common";
import PagerView from "react-native-pager-view";

import {
  INSTRUMENT_PAGES,
  NO_INSTRUMENT_PAGES,
} from "@hongpung/src/features/session/checkOutRoom/constant/descriptionPage";

import { PageIndicator } from "@hongpung/src/common/ui/PageIndicator";
import { DescriptionPage } from "@hongpung/src/common/ui/DescriptionPage";
import { CheckOutStepProps } from "@hongpung/src/features/session/checkOutRoom/model/types";
import { StepProps } from "@hongpung/react-step-flow";

type CheckOutDescriptionProps = StepProps<
  CheckOutStepProps,
  "CheckOutDescription"
>;

export const CheckOutDescriptionWidget: React.FC<CheckOutDescriptionProps> = ({
  stepProps: { session },
  goTo,
}) => {
  const onNext = () => {
    goTo("Camera");
  };
  const [pageNum, setPageNum] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  if (!session) return null;

  const pages =
    session.borrowInstruments && session.borrowInstruments.length > 0
      ? INSTRUMENT_PAGES
      : NO_INSTRUMENT_PAGES;

  const nextPage = () => {
    if (pagerRef.current) {
      pagerRef.current.setPage(pageNum + 1);
    }
  };

  const handlePageChange = (position: number) => {
    setPageNum(position);
  };

  const isLastPage = pageNum === pages.length - 1;
  return (
    <View style={styles.basicBackground}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>이용 종료 전 확인해주세요!</Text>
        <PagerView
          style={styles.pager}
          initialPage={0}
          onPageScroll={(e) => handlePageChange(e.nativeEvent.position)}
          ref={pagerRef}
        >
          {pages.map((page, index) => (
            <DescriptionPage key={index} {...page} />
          ))}
        </PagerView>
      </View>
      <View style={styles.footer}>
        <PageIndicator currentPage={pageNum} totalPages={pages.length} />
        <View style={styles.buttonContainer}>
          <LongButton
            color="blue"
            isAble={true}
            innerContent={isLastPage ? "촬영하기" : "다음"}
            onPress={() => (isLastPage ? onNext() : nextPage())}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  basicBackground: {
    flexGrow: 1,
    flex: 1,
    backgroundColor: "#FFF",
  },
  contentContainer: {
    position: "relative",
    flexDirection: "column",
    flexGrow: 1,
  },
  title: {
    textAlign: "center",
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 20,
    paddingTop: 48,
  },
  pager: {
    flexGrow: 1,
    borderRadius: 8,
  },
  footer: {
    gap: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 12,
  },
});
