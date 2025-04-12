import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import InstrumentViewList from '@hongpung/src/widgets/InstrumentViewList/InstrumentViewList';
import { type Instrument } from '@hongpung/src/entities/instrument';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '@hongpung/src/common/ui/header/Header';

const ReservationInstrumentsViewScreen: React.FC<ReservationStackProps<'ReservationInstrumentsView'>> = ({ navigation, route }) => {
  const { instruments } = route.params;
  const instrumentList: Instrument[] = JSON.parse(instruments);

  const handleInstrumentClick = (instrument: Instrument) => {
    // Handle instrument click
  };

  return (
    <View style={styles.container}>
      <Header
        leftButton={'close'}
        HeaderName='대여 악기 목록'
      />
      <View style={styles.content}>
        <InstrumentViewList
          instrumentList={instrumentList}
          onInstrumentClick={handleInstrumentClick}
        />
      </View>
    </View>
  );
};

export default ReservationInstrumentsViewScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    content: {
      flex: 1,
    },
  });