import { Member } from "../../member/@x/club";

export type ClubInfoDto = {
  profileImageUrl: string | null;
  club: string;
  leader: Member | null;
  sangsoe: Member | null;
};
