import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Color } from '@hongpung/src/common';

interface EmptyScheduleProps {
  navigateToReservation: () => void;
}

const EmptySchedule: React.FC<EmptyScheduleProps> = ({
    navigateToReservation,
}) => {
  return (
    <View style={[styles.container, { justifyContent: 'center' }]}>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>예정된 일정이 없어요!</Text>
        <Pressable onPress={navigateToReservation}>
          <Text style={styles.navigateText}>
            {`새 일정 예약하러 가기  >`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  contentContainer: {
    marginTop: -120,
    alignItems: 'center',
    gap: 12,
  },
  titleText: {
    fontSize: 24,
    fontFamily: 'NanumSquareNeo-Bold',
    color: Color['grey800'],
  },
  navigateText: {
    fontSize: 16,
    fontFamily: 'NanumSquareNeo-Regular',
    color: Color['grey400'],
  },
});

export default EmptySchedule; 