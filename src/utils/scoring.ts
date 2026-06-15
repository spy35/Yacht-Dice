// src/utils/scoring.ts
import type { DieType } from '../types/game';

export const calculateScore = (categoryId: string, dice: DieType[]): number => {
    const values = dice.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    
    // 각 눈금(1~6)이 몇 개씩 나왔는지 카운트 배열 (인덱스 1~6 사용)
    const counts = [0, 0, 0, 0, 0, 0, 0];
    values.forEach(v => counts[v]++);

    switch (categoryId) {
        case 'aces': return counts[1] * 1;
        case 'twos': return counts[2] * 2;
        case 'threes': return counts[3] * 3;
        case 'fours': return counts[4] * 4;
        case 'fives': return counts[5] * 5;
        case 'sixes': return counts[6] * 6;
        case 'choice': return sum;
        case 'fullHouse':
            const hasThree = counts.some(c => c === 3);
            const hasTwo = counts.some(c => c === 2);
            const hasFive = counts.some(c => c === 5);
            return ((hasThree && hasTwo) || hasFive) ? sum : 0;
            
        case 'straight':
            const isStraight =
                // 1. 리틀 스트레이트 (1-2-3-4-5)
                (counts[1] > 0 && counts[2] > 0 && counts[3] > 0 && counts[4] > 0 && counts[5] > 0) ||
                // 2. 빅 스트레이트 (2-3-4-5-6)
                (counts[2] > 0 && counts[3] > 0 && counts[4] > 0 && counts[5] > 0 && counts[6] > 0);
            
            // 둘 중 하나라도 만족하면 30점, 아니면 0점
            return isStraight ? 30 : 0;

        case 'yacht':
            return counts.some(c => c === 5) ? 50 : 0;
        default:
            return 0;
    }
};