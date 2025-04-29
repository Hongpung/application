export type RequestLoginBody = {
    email: string
    password: string
}

export interface SignUpRequestBody {
    email: string;
    password: string;
    name: string;
    nickname?: string;
    clubId: number | null;
    enrollmentNumber: string;
  }
  