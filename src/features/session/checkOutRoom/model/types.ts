import { PhotoFileFormat } from "@hongpung/src/common/types/PhotoFileFormat";
import { Session } from "@hongpung/src/entities/session";
import { SessionLog } from "@hongpung/src/entities/session-log";

export type CheckOutStep = keyof CheckOutStepProps;

export type CheckOutStepProps = {
  // CheckOutConfirm: CheckOutConfirmStepProps;
  CheckOutDescription: CheckOutDescriptionStepProps;
  Camera: CheckOutCameraStepProps;
  ConfirmPhotos: CheckOutConfirmPhotosStepProps;
  CheckOutComplete: CheckOutCompleteStepProps;
  CheckOutSummary: CheckOutSummaryStepProps;
};

export interface CheckOutConfirmStepProps {
  session: Session;
}

export interface CheckOutSummaryStepProps {
  endSessionData: SessionLog | null;
  onHome: () => void;
}

export interface CheckOutDescriptionStepProps {
  session: Session;
}

export interface CheckOutCameraStepProps {
  session: Session;
  setPhotos: React.Dispatch<PhotoFileFormat[]>;
  demadingPhotoCount: number;
}

export interface CheckOutConfirmPhotosStepProps {
  session: Session;
  photos: PhotoFileFormat[];
}

export interface CheckOutCompleteStepProps {
  isLoading: boolean;
  endSession: () => void;
}

export interface CheckOutContext {
  isLoading: boolean;
  onStep: CheckOutStep;
  setStep: (newStep: CheckOutStep) => void;
  photos: PhotoFileFormat[];
  setPhotos: (photos: PhotoFileFormat[]) => void;
  session: Session;
  endSession: () => void;
}
