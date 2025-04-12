import { Instrument } from "@hongpung/src/entities/instrument";
import { useCallback, useMemo, useState } from "react";

const useInstrumentsList = ({ instrumentList }: { instrumentList: Instrument[] }) => {

    const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

    const toggleAccordion = (type: string) => {
        setOpenMap(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const isOpen = (type: string) => !!openMap[type];

    const orderInstruments = useMemo(() => {

        const instrumentMappedByType: Record<string, Instrument[]> = {
            "꽹과리": [],
            "징": [],
            "장구": [],
            "북": [],
            "소고": [],
            "기타": []
        };

        instrumentList.forEach(instrument => {

            if (!instrumentMappedByType[instrument.instrumentType]) {
                instrumentMappedByType[instrument.instrumentType] = [];
            }

            instrumentMappedByType[instrument.instrumentType].push(instrument);

        });

        return instrumentMappedByType;

    }, [instrumentList]);

    return { toggleAccordion, isOpen, orderInstruments }
}

export { useInstrumentsList as useBorrowInstrumentsList }