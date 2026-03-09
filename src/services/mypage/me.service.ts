import client from "../../lib/api/client";

/**
 * 로그인 유저 정보 조회 API
 */
export const getMe = async () => {
  const res = await client.get("/api/users/me");
  return res.data;
};

/**
 * 유저 정보 수정 API
 * PATCH /api/users/me
 */
export const patchMe = async (nickname?: string, userProfileImg?: any) => {
  const formData = new FormData();

  if (nickname) {
    formData.append("nickname", nickname);
  }

  if (userProfileImg) {
    formData.append("userProfileImg", userProfileImg as any);
  }

  const parts = (formData as any)?._parts;
  console.log("[patchMe] request payload", {
    nickname,
    hasImage: !!userProfileImg,
    imageName: userProfileImg?.name,
    imageType: userProfileImg?.type,
    imageUri: userProfileImg?.uri,
    formDataParts: parts,
  });

  const res = await client.patch("/api/users/me", formData);

  return res.data;
};
