import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ManageInstrumentCard } from '@hongpung/src/entities/instrument/ui/ManageInstrumentCard/ManageInstrumentCard';
import { type Instrument } from '@hongpung/src/entities/instrument';
import { Color, Icons } from '@hongpung/src/common';
import { useBorrowInstrumentsList } from '@hongpung/src/features/reservation/figureReservation/lib/useBorrowInstrumentsList';

interface InstrumentViewListProps {
    instrumentList: Instrument[];
    onInstrumentClick: (instrument: Instrument) => void;
}

const InstrumentViewList: React.FC<InstrumentViewListProps> = ({ instrumentList, onInstrumentClick }) => {

    const { isOpen, toggleAccordion, orderInstruments } = useBorrowInstrumentsList({ instrumentList })

    return (
        <ScrollView style={styles.container}>
            {Object.entries(orderInstruments).map(([type, instruments]) => {
                if (instruments.length === 0) return null;

                return (
                    <View key={type}>
                        <Pressable onPress={() => toggleAccordion(type)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8 }}>

                            <Text style={styles.ArccodianMenuText}>
                                {type}
                            </Text>

                            <Icons name={isOpen(type) ? "chevron-up" : "chevron-down"} color={Color["grey800"]} size={24} />

                        </Pressable>
                        <View style={styles.instrumentContainer}>
                            {instruments.map((instrument, index) => (
                                <ManageInstrumentCard
                                    key={`${instrument.name}-${index}`}
                                    instrument={instrument}
                                    onClickInstrument={onInstrumentClick}
                                />
                            ))}
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 24,
    },
    typeHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    typeText: {
        fontFamily: 'NanumSquareNeo-Bold',
        fontSize: 18,
        color: Color['grey500'],
    },
    instrumentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        rowGap: 16,
        paddingVertical: 12,
    },
    ArccodianMenu: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    ArccodianMenuText: {
        fontFamily: "NanumSquareNeo-Bold",
        fontSize: 18,
        color: Color["grey800"]
    }
});

export default InstrumentViewList;