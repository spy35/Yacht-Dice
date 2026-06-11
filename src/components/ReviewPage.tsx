// src/components/ReviewPage.tsx
import { useState } from 'react';
import { Container, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import Die from './Die';
import ScoreBoard from './ScoreBoard';
import type { GameRecord } from '../types/game';

type ReviewPageProps = {
    record: GameRecord;
    onBack: () => void; // 목록으로 돌아가기 함수
};

const ReviewPage = ({ record, onBack }: ReviewPageProps) => {
    // 0번째 원소 = 1턴, 9번째 원소 = 10턴(마지막 턴)
    const [turnIndex, setTurnIndex] = useState<number>(0);
    const currentTurn = record.history[turnIndex];

    const handleNext = () => {
        if (turnIndex < record.history.length - 1) setTurnIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (turnIndex > 0) setTurnIndex(prev => prev - 1);
    };

    // 현재 턴의 주as위 객체 가공 (Die 컴포넌트 포맷에 맞춤)
    const reviewDice = currentTurn.diceValues.map((d, index) => ({
        id: index + 1,
        value: d.value,
        isKept: d.isKept
    }));

    return (
        <Container className="py-4" style={{ maxWidth: '1000px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="outline-dark" onClick={onBack} className="fw-bold">
                    ← 기록 목록으로 돌아가기
                </Button>
                <h4 className="m-0 text-muted fw-bold">{record.date} 판 복기 모드</h4>
            </div>

            {/* 상단 컨트롤러 슬라이드 바 */}
            <Card className="mb-4 bg-dark text-white border-0 shadow-sm">
                <Card.Body className="d-flex justify-content-between align-items-center py-3">
                    <Button variant="outline-light" onClick={handlePrev} disabled={turnIndex === 0} className="fw-bold">
                        ◀ 이전 턴
                    </Button>
                    <div className="text-center">
                        <span className="fs-4 fw-bold text-warning">{turnIndex + 1} / {record.history.length} 턴</span>
                        <div className="text-light mt-1" style={{ fontSize: '0.95rem' }}>
                            선택한 족보: <Badge bg="danger" className="fs-6 ms-1">{currentTurn.chosenCategoryId.toUpperCase()}</Badge> 
                            ({currentTurn.gainedScore}점 획득)
                        </div>
                    </div>
                    <Button variant="outline-light" onClick={handleNext} disabled={turnIndex === record.history.length - 1} className="fw-bold">
                        다음 턴 ▶
                    </Button>
                </Card.Body>
            </Card>

            <Row className="g-4">
                {/* 왼쪽: 당시 주as위 보관 상태 시각화 (Die 컴포넌트 재활용) */}
                <Col lg={6}>
                    <Card className="border p-4 bg-light text-center shadow-sm" style={{ minHeight: '350px' }}>
                        <h4 className="fw-bold text-dark mb-4">🎲 당시 주사위 최종 배치</h4>
                        
                        <h6 className="text-secondary">필드 (Field)</h6>
                        <div className="d-flex justify-content-center my-3 bg-white py-2 rounded border" style={{ minHeight: '100px' }}>
                            {reviewDice.filter(d => !d.isKept).map(d => (
                                <Die key={d.id} die={d} size="65px" />
                            ))}
                        </div>

                        <h6 className="text-warning fw-bold mt-3">보관함 (Keep)</h6>
                        <div className="d-flex justify-content-center my-3 rounded border" style={{ minHeight: '100px', backgroundColor: '#fff3cd' }}>
                            {reviewDice.filter(d => d.isKept).map(d => (
                                <Die key={d.id} die={d} size="65px" />
                            ))}
                        </div>
                    </Card>
                </Col>

                {/* 오른쪽: 당시 점수판 진행 상황 렌더링 (ScoreBoard 컴포넌트 완벽 재활용) */}
                <Col lg={6}>
                    {/* isReviewMode={true}와 highlightedCategory를 Props로 던져주어 
                        과거 점수판 상태를 그리고, 이번 턴에 고른 행을 초록/노란색으로 강조합니다.
                    */}
                    <ScoreBoard 
                        categories={currentTurn.categoriesState} 
                        dice={reviewDice} 
                        rollsLeft={3} 
                        selectCategory={() => null} // 클릭 차단
                        isReviewMode={true} 
                        highlightedCategory={currentTurn.chosenCategoryId}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default ReviewPage;