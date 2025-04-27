import { useMemo, useState } from "react";
import { Instrument } from "./type";

const useInstrumentList = ({ instrumentList }: { instrumentList: Instrument[]|null }) => {

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

        if (!instrumentList) return instrumentMappedByType;

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

export { useInstrumentList }