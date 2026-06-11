// src/components/ScoreBoard.tsx
import { Container, Table } from 'react-bootstrap';
import type { CategoryType, DieType } from '../types/game';
import { calculateScore } from '../utils/scoring';

type ScoreBoardProps = {
    categories: CategoryType[];
    dice: DieType[];
    rollsLeft: number;
    selectCategory: (categoryId: string, score: number) => void;
    // ⭐️ 추가: 복기 전용 속성들
    isReviewMode?: boolean;
    highlightedCategory?: string;
};

const ScoreBoard = ({ categories, dice, rollsLeft, selectCategory, isReviewMode = false, highlightedCategory }: ScoreBoardProps) => {
    // 복기 모드가 아닐 때만 주as위를 한 번이라도 굴렸는지 체크
    const isRolled = !isReviewMode && rollsLeft < 3;

    const totalScore = categories.reduce((sum, cat) => sum + (cat.score !== null ? cat.score : 0), 0);

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

                        // ⭐️ 스타일 분기 조건문 세팅
                        const isThisTurnPick = isReviewMode && cat.id === highlightedCategory; // 이번 슬라이드에서 고른 족보인가?

                        let rowBgColor = 'inherit';
                        if (isThisTurnPick) rowBgColor = '#c6efce'; // 복기 모드 픽 행은 부드러운 초록색 배경
                        else if (isLocked && !isReviewMode) rowBgColor = '#e9ecef'; // 인게임 일반 잠금 행은 회색 배경

                        return (
                            <tr 
                                key={cat.id} 
                                // 복기 모드일 때는 클릭 이벤트를 원천 차단시킵니다.
                                onClick={() => (!isLocked && isRolled && !isReviewMode) ? selectCategory(cat.id, potentialScore) : null}
                                style={{ 
                                    cursor: (!isLocked && isRolled && !isReviewMode) ? 'pointer' : 'default',
                                    backgroundColor: rowBgColor,
                                    border: isThisTurnPick ? '2.5px solid #2e7d32' : '1px solid #dee2e6' // 강조 테두리
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