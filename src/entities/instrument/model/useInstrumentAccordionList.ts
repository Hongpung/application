import { useMemo, useState } from "react";
import { Instrument } from "./type";

export const useInstrumentAccordionList = ({
  instrumentList,
}: {
  instrumentList: Instrument[] | null;
}) => {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggleAccordion = (type: string) => {
    setOpenMap((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const isOpen = (type: string) => !!openMap[type];

  const orderedInstrumentData = useMemo(() => {
    const instrumentMappedByType: Record<InstrumentType, Instrument[]> = {
      꽹과리: [],
      징: [],
      장구: [],
      북: [],
      소고: [],
      기타: [],
    };
  
    if (!instrumentList) return [];
  
    for (const instrument of instrumentList) {
      const type = instrument.instrumentType;
      instrumentMappedByType[type].push(instrument);
    }
  
    // 여기서 바로 [type, instruments] 배열로 정제 (비어있지 않은 것만)
    return (Object.entries(instrumentMappedByType) as [InstrumentType, Instrument[]][])
      .filter(([_, instruments]) => instruments.length > 0)
      .map(([type, instruments]) => ({ type, instruments }));
  }, [instrumentList]);

  return { toggleAccordion, isOpen, orderedInstrumentData };
};