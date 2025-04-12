import { Color, Icons } from "@hongpung/src/common";
import { BorrowInstrumentCard, Instrument } from "@hongpung/src/entities/instrument";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, View, Text } from "react-native";
import { useBorrowInstrumentsList } from "../../lib/useBorrowInstrumentsList";

type BorrowInstrumentsListProps = {
    instrumentList: Instrument[];
    selectedInstruments: Instrument[];
    selectInstruments: (instrument: Instrument[]) => void;
}

const BorrowInstrumentsList: React.FC<BorrowInstrumentsListProps> = ({ instrumentList, selectedInstruments, selectInstruments }) => {

    const { isOpen, toggleAccordion, orderInstruments } = useBorrowInstrumentsList({ instrumentList })

    const containsInstrument =
        useCallback((instrument: Instrument) =>
            selectedInstruments.some(existInstrument => existInstrument.instrumentId === instrument.instrumentId), [selectedInstruments])

    const addInstruments = (instrument: Instrument) => {
        selectInstruments([...selectedInstruments, instrument]);
    };

    const removeInstruments = (instrument: Instrument) => {
        selectInstruments(selectedInstruments.filter(existInstrument => existInstrument.instrumentId !== instrument.instrumentId));
    };

    return (
        <ScrollView>
            {Object.entries(orderInstruments).map(([type, instruments]) => {
                if (instruments.length === 0) return null;

                const selectedCount = instruments.filter(instrument =>
                    containsInstrument(instrument) && instrument.instrumentType === type
                ).length;

                const hasSelected = selectedCount > 0;

                return (
                    <View key={type}>

                        <Pressable onPress={() => toggleAccordion(type)} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 8 }}>

                            <Text style={{ fontFamily: "NanumSquareNeo-Bold", fontSize: 18, color: hasSelected ? Color["blue500"] : Color["grey800"] }}>
                                {type}{selectedCount > 0 && ` (${selectedCount})`}
                            </Text>

                            <Icons name={isOpen(type) ? "chevron-up" : "chevron-down"} color={Color["grey800"]} size={24} />

                        </Pressable>

                        {isOpen(type) && (
                            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 8, rowGap: 16, paddingVertical: 12 }}>

                                {instruments.map((instrument, index) => (
                                    <BorrowInstrumentCard
                                        key={index}
                                        instrument={instrument}
                                        isPicked={containsInstrument(instrument)}
                                        onClickInstrument={() => {
                                            const isContained = containsInstrument(instrument);

                                            if (isContained) {
                                                removeInstruments(instrument);
                                            } else {
                                                addInstruments(instrument);
                                            }

                                        }
                                        }
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default BorrowInstrumentsList