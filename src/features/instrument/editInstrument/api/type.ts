export interface InstrumentEditBody {
  instrumentId: number;
  name: string;
  instrumentType: InstrumentType;
  borrowAvailable: boolean;
  imageUrl?: string | null;
}
