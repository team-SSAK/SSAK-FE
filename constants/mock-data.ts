export interface MockRestaurant {
  id: number;
  name: string;
  address: string;
  image?: string;
  mealType: string;
  menu: string;
  hours: string;
}

export interface MockCoupon {
  id: number;
  used: boolean;
  wished: boolean;
  storeName: string;
  title: string;
  price: string;
  image?: string;
}

export interface MockPointHistory {
  pointHistId: number;
  pointAmount: number;
  pointDesc: string;
  pointType: "SAVE" | "USE" | "REFUND";
  pointTime: string | null;
}

export const MOCK_PROFILE = {
  nickname: "싹싹이",
  email: "ssak@example.com",
  point: 1280,
};

export const MOCK_RESTAURANTS: MockRestaurant[] = [
  {
    id: 101,
    name: "한우리집 학생식당",
    address: "서울 서대문구 이화여대길 52 ECC B4",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    mealType: "중식",
    menu: "제육볶음, 쌀밥, 미역국, 샐러드, 깍두기",
    hours: "11:00 - 19:00",
  },
  {
    id: 102,
    name: "생활관 푸드코트",
    address: "서울 서대문구 이화여대길 52 생활관 1층",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
    mealType: "석식",
    menu: "돈까스, 크림스프, 양배추샐러드, 단무지",
    hours: "17:00 - 20:30",
  },
  {
    id: 103,
    name: "캠퍼스 그린키친",
    address: "서울 서대문구 이화여대길 52 학생문화관 2층",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    mealType: "브런치",
    menu: "치킨샐러드, 베이글, 수프, 오렌지주스",
    hours: "09:30 - 16:00",
  },
];

export const MOCK_COUPONS: MockCoupon[] = [
  {
    id: 201,
    used: false,
    wished: true,
    storeName: "GS25",
    title: "새콤달콤 포도맛 15% 할인 쿠폰",
    price: "200P",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 202,
    used: true,
    wished: false,
    storeName: "CU",
    title: "아메리카노 20% 할인 쿠폰",
    price: "150P",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 203,
    used: false,
    wished: true,
    storeName: "스타벅스",
    title: "카라멜 마키아토 10% 할인 쿠폰",
    price: "300P",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 204,
    used: false,
    wished: false,
    storeName: "올리브영",
    title: "스킨케어 상품 10% 할인 쿠폰",
    price: "100P",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 205,
    used: true,
    wished: true,
    storeName: "배달의민족",
    title: "치킨 3,000원 할인 쿠폰",
    price: "400P",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  },
];

export const MOCK_POINT_HISTORY: MockPointHistory[] = [
  {
    pointHistId: 301,
    pointAmount: 120,
    pointDesc: "한우리집 잔반 인증 적립",
    pointType: "SAVE",
    pointTime: "2026-03-16T11:20:00",
  },
  {
    pointHistId: 302,
    pointAmount: 300,
    pointDesc: "스타벅스 쿠폰 교환",
    pointType: "USE",
    pointTime: "2026-03-15T14:05:00",
  },
  {
    pointHistId: 303,
    pointAmount: 80,
    pointDesc: "그린키친 잔반 인증 적립",
    pointType: "SAVE",
    pointTime: "2026-03-15T12:10:00",
  },
  {
    pointHistId: 304,
    pointAmount: 50,
    pointDesc: "이벤트 참여 포인트 환급",
    pointType: "REFUND",
    pointTime: "2026-03-14T18:40:00",
  },
];
