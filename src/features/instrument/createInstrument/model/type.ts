import { InstrumentType } from "@hongpung/src/entities/instrument";

export interface InstrumentCreateData {
    name: string;
    instrumentType: InstrumentType | null;
    selectedImage: File | null;
}