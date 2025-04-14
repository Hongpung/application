import { PhotoFileFormat } from "@hongpung/src/common/types/PhotoFileFormat";
import { RealtimeSession, ReservationSession } from "@hongpung/src/entities/session";

export type CheckOutStep = 
  | 'CheckOutConfirm' 
  | 'CheckOutDescription' 
  | 'Camera' 
  | 'ConfirmPhotos' 
  | 'CheckOutComplete';

export interface CheckOutContext {
  isLoading: boolean;
  onStep: CheckOutStep;
  setStep: (newStep: CheckOutStep) => void;
  photos: PhotoFileFormat[];
  setPhotos: (photos: PhotoFileFormat[]) => void;
  usingSession: ReservationSession | RealtimeSession | null;
  endSession: () => void;
} 