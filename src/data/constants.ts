// src/data/constants.ts
import type { DieType, CategoryType } from '../types/game';

// 1. 게임 시작 시 주사위 5개의 초기 상태
export const INITIAL_DICE: DieType[] = [
    { id: 1, value: 1, isKept: false },
    { id: 2, value: 2, isKept: false },
    { id: 3, value: 3, isKept: false },
    { id: 4, value: 4, isKept: false },
    { id: 5, value: 5, isKept: false },
];

// 2. 게임 시작 시 10가지 족보 카테고리의 초기 상태
export const INITIAL_CATEGORIES: CategoryType[] = [
    { id: 'aces', name: 'Aces (1의 눈금)', score: null },
    { id: 'twos', name: 'Twos (2의 눈금)', score: null },
    { id: 'threes', name: 'Threes (3의 눈금)', score: null },
    { id: 'fours', name: 'Fours (4의 눈금)', score: null },
    { id: 'fives', name: 'Fives (5의 눈금)', score: null },
    { id: 'sixes', name: 'Sixes (6의 눈금)', score: null },
    { id: 'choice', name: 'Choice (초이스)', score: null },
    { id: 'fullHouse', name: 'Full House (풀하우스)', score: null },
    { id: 'straight', name: 'Straight (스트레이트)', score: null },
    { id: 'yacht', name: 'Yacht (요트!)', score: null },
];