import { useEffect, useState } from "react";
import { getMe } from "../services/mypage/me.service";

export function useMe() {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await getMe();
        setNickname(me.userNm);
      } catch (e) {
        console.log("유저 조회 실패", e);
        setNickname("");
      }
    };

    fetchMe();
  }, []);

  return { nickname };
}
