import { InstrumentDto } from "../api/type";
import { Instrument } from "../model/type";

export function mapInstrument(instrumentDto: InstrumentDto): Instrument {
  return {
    instrumentId: instrumentDto.instrumentId,
    instrumentType: instrumentDto.instrumentType,
    name: instrumentDto.name,
    club: instrumentDto.club,
    borrowAvailable: instrumentDto.borrowAvailable,
    imageUrl: instrumentDto.imageUrl,
  };
}
