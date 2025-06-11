export interface Member {
  memberId: number;
  name: string;
  nickname?: string;
  club: ClubName;
  email: string;
  enrollmentNumber: string;
  role: string[];
  profileImageUrl?: string;
  instagramUrl?: string;
  blogUrl?: string;
}
