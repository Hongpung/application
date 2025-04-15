export interface SignUpRequestBody {
  email: string;
  password: string;
  name: string;
  nickname?: string;
  clubId: number | null;
  enrollmentNumber: string;
}
