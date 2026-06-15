// src/pages/ReviewPage.tsx 전체 교체 코드
import { useState } from 'react';
import { Container, Button, Card, Row, Col, Badge } from 'react-bootstrap';
import DiceBoard from '../components/DiceBoard'; 
import ScoreBoard from '../components/ScoreBoard'; 
import type { GameRecord } from '../types/game';

type ReviewPageProps = {
    record: GameRecord; // 복기할 게임 기록, GameRecord 타입의 객체로서 플레이 일시, 최종 점수, 그리고 각 턴의 주사위 상태와 선택한 족보 카테고리 등의 상세 정보를 포함하고 있음
    onBack: () => void;  // 기록 목록으로 돌아가는 함수, 사용자가 "기록 목록으로 돌아가기" 버튼을 클릭할 때 호출되어 복기 페이지에서 기록 목록 페이지로 이동하는 등의 UI 로직이 실행됨
};

const ReviewPage = ({ record, onBack }: ReviewPageProps) => {
    const [turnIndex, setTurnIndex] = useState<number>(0); // 현재 복기 중인 턴의 인덱스, 초기값은 0으로 설정되어 있으며 사용자가 "이전 턴" 또는 "다음 턴" 버튼을 클릭할 때마다 증가하거나 감소하여 복기할 턴을 변경하는 로직이 실행됨
    const currentTurn = record.history[turnIndex]; // 현재 복기 중인 턴의 상세 정보, record.history 배열에서 turnIndex에 해당하는 요소를 가져와서 현재 턴의 주사위 상태, 선택한 족보 카테고리, 획득한 점수 등의 정보를 담고 있음

    const handleNext = () => {
        if (turnIndex < record.history.length - 1) setTurnIndex(prev => prev + 1);
    }; // 다음 턴으로 이동하는 함수, 사용자가 "다음 턴" 버튼을 클릭할 때 호출되어 turnIndex가 증가하여 다음 턴의 정보를 보여주는 로직이 실행됨

    const handlePrev = () => {
        if (turnIndex > 0) setTurnIndex(prev => prev - 1);
    }; // 이전 턴으로 이동하는 함수, 사용자가 "이전 턴" 버튼을 클릭할 때 호출되어 turnIndex가 감소하여 이전 턴의 정보를 보여주는 로직이 실행됨

    const reviewDice = currentTurn.diceValues.map((d, index) => ({
        id: index + 1,
        value: d.value,
        isKept: d.isKept
    })); // 현재 턴의 주사위 상태를 DiceBoard 컴포넌트에서 사용할 수 있는 형태로 변환하는 로직, currentTurn.diceValues 배열을 map하여 각 주사위의 id, value, 그리고 isKept 상태를 포함하는 객체 배열로 만들어 reviewDice 변수에 저장함

    return (
        <Container className="py-4" style={{ maxWidth: '1000px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="outline-dark" onClick={onBack} className="fw-bold">
                    ← 기록 목록으로 돌아가기
                </Button>
                <h4 className="m-0 text-muted fw-bold">{record.date} 판 복기 모드</h4>
            </div>

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
                <Col lg={6}>
                    <DiceBoard 
                        dice={reviewDice} 
                        rollsLeft={0} 
                        isReadOnly={true} 
                    /> {/* DiceBoard 컴포넌트에 reviewDice를 전달하여 현재 턴의 주사위 상태를 보여주고, rollsLeft는 0으로 설정하여 굴리기 버튼을 비활성화하며, isReadOnly를 true로 설정하여 주사위를 클릭해도 보관 상태가 변경되지 않도록 하는 로직이 실행됨 */}
                </Col>

                <Col lg={6}>
                    <ScoreBoard 
                        categories={currentTurn.categoriesState} 
                        dice={reviewDice} 
                        rollsLeft={3} 
                        selectCategory={() => null} 
                        isReviewMode={true} 
                        highlightedCategory={currentTurn.chosenCategoryId}
                    /> {/* ScoreBoard 컴포넌트에 현재 턴의 카테고리 상태와 reviewDice를 전달하여 점수판과 주사위 상태를 보여주고, rollsLeft는 3으로 설정하여 점수 선택이 가능한 것처럼 보이게 하지만 selectCategory는 빈 함수로 전달하여 실제로 선택은 불가능하게 하며, isReviewMode를 true로 설정하여 점수판에서 선택할 수 없도록 하고, highlightedCategory에 currentTurn.chosenCategoryId를 전달하여 현재 턴에서 선택한 족보 카테고리를 강조 표시하는 로직이 실행됨 */}
                </Col>
            </Row>
        </Container>
    );
};

export default ReviewPage;