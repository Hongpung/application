import { Member } from "../model/type";
import { UpdateMyStatusRequestBody } from "../api/type";

export const mapProfileUpdateBody = (
  currentUser: Member,
  data: Member,
): UpdateMyStatusRequestBody => {
  const { nickname, profileImageUrl, enrollmentNumber, instagramUrl, blogUrl } =
    data;

  console.log(profileImageUrl, currentUser?.profileImageUrl);

  return {
    nickname:
      nickname !== currentUser?.nickname
        ? nickname?.trim().length === 0
          ? null
          : nickname
        : undefined,
    profileImageUrl:
      profileImageUrl !== currentUser?.profileImageUrl
        ? (profileImageUrl ?? null)
        : undefined,
    enrollmentNumber:
      enrollmentNumber !== currentUser?.enrollmentNumber
        ? enrollmentNumber
        : undefined,
    instagramUrl:
      instagramUrl !== currentUser?.instagramUrl
        ? instagramUrl?.trim().length === 0
          ? null
          : instagramUrl
        : undefined,
    blogUrl:
      blogUrl !== currentUser?.blogUrl
        ? blogUrl?.trim().length === 0
          ? null
          : blogUrl
        : undefined,
  };
};
