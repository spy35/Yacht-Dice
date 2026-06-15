// src/components/ScoreBoard.tsx
import { useMemo } from 'react'; // 점수 계산 최적화를 위해 useMemo 사용
import { Container, Table } from 'react-bootstrap';
import type { CategoryType, DieType } from '../types/game'; // 게임 관련 타입 정의 가져오기
import { calculateScore } from '../utils/scoring'; // 점수 계산 로직을 별도의 유틸 함수로 분리

type ScoreBoardProps = {
    categories: CategoryType[]; // 현재 게임의 족보 카테고리와 점수 상태를 나타내는 배열
    dice: DieType[]; // 현재 굴린 주사위들의 상태를 나타내는 배열
    rollsLeft: number; // 현재 턴에서 남은 굴림 횟수 (0~3)
    selectCategory: (categoryId: string, score: number) => void; // 특정 족보 항목 선택 시 호출되는 콜백 함수, 선택된 카테고리 ID와 계산된 점수를 인자로 받음
    isReviewMode?: boolean; // 점수판이 현재 리뷰 모드인지 여부를 나타내는 선택적 prop(속성), 리뷰 모드에서는 점수판이 과거 턴의 상태를 보여줌
    highlightedCategory?: string; // 리뷰 모드에서 현재 턴에 선택된 족보 항목의 ID를 나타내는 선택적 prop(속성), 해당 항목은 점수판에서 강조 표시됨
};

const ScoreBoard = ({ categories, dice, rollsLeft, selectCategory, isReviewMode = false, highlightedCategory }: ScoreBoardProps) => { // 컴포넌트의 주요 기능은 족보 항목별 점수와 총점을 표시하는 것, isReviewMode 값을 주지 않으면 기본적으로 false(일반 게임 모드)로 설정
    const isRolled = !isReviewMode && rollsLeft < 3; // 리뷰 모드가 아니고, 아직 한 번이라도 굴렸다면 true, 그렇지 않으면 false

    const totalScore = useMemo(() => {
        return categories.reduce((sum, cat) => sum + (cat.score !== null ? cat.score : 0), 0);
    }, [categories]); // categories 배열이 변경될 때마다 총점을 재계산, useMemo를 사용하여 불필요한 계산 방지

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
                    {categories.map(cat => { // 각 족보 카테고리에 대해 테이블 행을 생성
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