import React, { useState, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import { LongButton } from "@hongpung/src/common";
import { Color } from "@hongpung/src/common";
import PagerView from "react-native-pager-view";
import { Session } from "@hongpung/src/entities/session";
import {
  INSTRUMENT_PAGES,
  NO_INSTRUMENT_PAGES,
} from "@hongpung/src/features/session/checkOutRoom/constant/descriptionPage";
import { PageIndicator } from "@hongpung/src/common/ui/PageIndicator";
import { DescriptionPage } from "@hongpung/src/common/ui/DescriptionPage";

interface CheckOutDescriptionWidgetProps {
  session: Session;
  onNext: () => void;
}

export const CheckOutDescriptionWidget: React.FC<
  CheckOutDescriptionWidgetProps
> = ({ session, onNext }) => {
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
        <Text style={styles.title}>연습실 정리 안내</Text>
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
    flex: 1,
    backgroundColor: Color.white,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 160,
    gap: 24,
  },
  title: {
    textAlign: "center",
    fontFamily: "NanumSquareNeo-Bold",
    fontSize: 20,
  },
  pager: {
    flex: 1,
    alignItems: "center",
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

export default CheckOutDescriptionWidget;
