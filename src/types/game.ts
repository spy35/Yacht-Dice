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

export type TurnSnapshot = {
    turnNumber: number;
    chosenCategoryId: string; // 해당 턴에 선택한 족보
    gainedScore: number;       // 해당 턴에 얻은 점수
    diceValues: { value: number; isKept: boolean }[]; // 당시 주사위 5개 상태
    categoriesState: CategoryType[]; // 당시 점수판 스냅샷
};

export type GameRecord = {
    id: string;
    date: string;
    score: number;
    history: TurnSnapshot[]; // 1턴부터 10턴까지의 전체 기록
};

export type DuelRecord = {
    id: string;
    date: string;
    playerSum: number;
    computerSum: number;
    playerDice: number[];
    computerDice: number[];
    result: 'WIN' | 'LOSE' | 'DRAW'; // 승, 패, 무 결과 상태
};