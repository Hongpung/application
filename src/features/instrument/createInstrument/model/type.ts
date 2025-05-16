export interface InstrumentCreateForm {
  name: string;
  instrumentType: InstrumentType | null;
  selectedImage: File | null;
}