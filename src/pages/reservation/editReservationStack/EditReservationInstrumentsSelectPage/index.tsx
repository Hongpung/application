import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { Instrument } from "@hongpung/src/entities/instrument";
import Header from '@hongpung/src/common/ui/header/Header'
import { Color } from "@hongpung/src/common";

import { useBorrowPossibleInstrumentsFetch } from "@hongpung/src/features/reservation/figureReservation/api/searchBorrowPossibleInstrumentsApi";
import { BorrowInstrumentsConfirmButton } from "@hongpung/src/features/reservation/figureReservation/ui/BorrowInstrumentsConfirmButton/BorrowInstrumentsConfirmButton";
import BorrowInstrumentsList from "@hongpung/src/features/reservation/figureReservation/ui/BorrowInstrumentsList/BorrowInstrumentsList";
import { useEditReservation } from "@hongpung/src/features/reservation/editReservation/model/useEditReservation.context";


const BorrowInstrumentSelectScreen: React.FC = () => {

    const { data, isLoading } = useBorrowPossibleInstrumentsFetch();
    const { reservation, setBorrowInstruments } = useEditReservation();
    const [newBorrowInstruments, setNewBorrowInstruments] = useState<Instrument[]>(reservation.borrowInstruments)


    return (
        <View style={styles.container}>
            <Header leftButton="close" HeaderName="대여 악기 선택" />

            <View style={styles.container}>
                {data && data.length === 0 ? (
                    <Text style={styles.emptyText}>
                        대여 할 수 있는 악기가 없습니다.
                    </Text>
                ) : (
                    <BorrowInstrumentsList
                        instrumentList={data ?? []}
                        selectInstruments={setNewBorrowInstruments}
                        selectedInstruments={newBorrowInstruments}
                    />
                )}
            </View>

            {reservation.borrowInstruments.length > 0 &&
                <BorrowInstrumentsConfirmButton
                    borrowInstrumentsLength={newBorrowInstruments.length}
                    onPress={() => { setBorrowInstruments(newBorrowInstruments) }}
                />
            }
        </View>
    );
};


export default BorrowInstrumentSelectScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    emptyText: {
        marginHorizontal: "auto",
        marginTop: 300,
        fontFamily: "NanumSquareNeo-Bold",
        fontSize: 18,
        color: Color["grey400"],
    },
});
