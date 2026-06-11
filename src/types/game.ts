// src/types/game.ts
export type DieType = {
    id: number;
    value: number;
    isKept: boolean;
};

export type CategoryType = {
    id: string;
    name: string;
    score: number | null;
};

// ⭐️ 추가: 각 턴이 끝날 때마다 기록될 턴 스냅샷 타입
export type TurnSnapshot = {
    turnNumber: number;
    chosenCategoryId: string; // 해당 턴에 선택한 족보
    gainedScore: number;       // 해당 턴에 얻은 점수
    diceValues: { value: number; isKept: boolean }[]; // 당시 주as위 5개 상태
    categoriesState: CategoryType[]; // 당시 점수판 스냅샷
};

// ⭐️ 변경: 플레이 결과 기록에 턴 기록 배열(TurnSnapshot[])을 탑재합니다.
export type GameRecord = {
    id: string;
    date: string;
    score: number;
    history: TurnSnapshot[]; // 1턴부터 10턴까지의 전체 기록
};