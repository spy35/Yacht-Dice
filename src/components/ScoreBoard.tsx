// src/components/ScoreBoard.tsx
// ⭐️ 1. React에서 useMemo를 불러옵니다.
import { useMemo } from 'react';
import { Container, Table } from 'react-bootstrap';
import type { CategoryType, DieType } from '../types/game';
import { calculateScore } from '../utils/scoring';

type ScoreBoardProps = {
    categories: CategoryType[];
    dice: DieType[];
    rollsLeft: number;
    selectCategory: (categoryId: string, score: number) => void;
    isReviewMode?: boolean;
    highlightedCategory?: string;
};

const ScoreBoard = ({ categories, dice, rollsLeft, selectCategory, isReviewMode = false, highlightedCategory }: ScoreBoardProps) => {
    const isRolled = !isReviewMode && rollsLeft < 3;

    // ⭐️ 2. useMemo를 적용하여 성능 최적화!
    // categories 배열이 변경될 때만 reduce 연산을 다시 수행합니다.
    const totalScore = useMemo(() => {
        return categories.reduce((sum, cat) => sum + (cat.score !== null ? cat.score : 0), 0);
    }, [categories]); // 👈 의존성 배열에 categories를 넣음

    return (
        <Container className="border p-4 rounded bg-light shadow-sm" style={{ minHeight: '520px' }}>
            <h3 className="mb-4">📊 {isReviewMode ? "⏳ 당시 점수판 기록 상황" : "점수판"}</h3>
            <Table bordered hover responsive className="text-center align-middle">
                <thead className="table-dark">
                    <tr>
                        <th style={{ width: '50%' }}>족보 항목</th>
                        <th style={{ width: '50%' }}>기록된 점수</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(cat => {
                        const isLocked = cat.score !== null;
                        const potentialScore = (!isLocked && isRolled) ? calculateScore(cat.id, dice) : 0;
                        const isThisTurnPick = isReviewMode && cat.id === highlightedCategory;

                        let rowBgColor = 'inherit';
                        if (isThisTurnPick) rowBgColor = '#c6efce';
                        else if (isLocked && !isReviewMode) rowBgColor = '#e9ecef';

                        return (
                            <tr 
                                key={cat.id} 
                                onClick={() => (!isLocked && isRolled && !isReviewMode) ? selectCategory(cat.id, potentialScore) : null}
                                style={{ 
                                    cursor: (!isLocked && isRolled && !isReviewMode) ? 'pointer' : 'default',
                                    backgroundColor: rowBgColor,
                                    border: isThisTurnPick ? '2.5px solid #2e7d32' : '1px solid #dee2e6'
                                }}
                            >
                                <td className={isThisTurnPick ? "fw-bold text-success fs-5" : isLocked ? "text-muted" : "fw-bold"}>
                                    {cat.name} {isThisTurnPick && "👈 PICK!"}
                                </td>
                                <td>
                                    {isLocked ? (
                                        <span className={isThisTurnPick ? "fw-bold text-success fs-4" : "fw-bold fs-5"}>{cat.score}</span>
                                    ) : (
                                        isRolled ? <span className="text-success fw-bold">{potentialScore}</span> : '-'
                                    )}
                                </td>
                            </tr>
                        );
                    })}

                    <tr className="table-warning" style={{ borderTop: '2px solid #333' }}>
                        <td className="fw-bold fs-5 text-dark">{isReviewMode ? "현재 누적 총점" : "TOTAL SCORE (총점)"}</td>
                        <td className="fw-bold fs-4 text-primary">{totalScore} 점</td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    );
};

export default ScoreBoard;