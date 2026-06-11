// src/components/RulesPage.tsx
import { Container, Card, ListGroup } from 'react-bootstrap';

const RulesPage = () => {
    return (
        <Container className="py-4" style={{ maxWidth: '800px' }}>
            <h2 className="fw-bold text-dark mb-4">📖 게임 사용법</h2>
            <Card className="shadow-sm border">
                <Card.Header className="bg-dark text-white fw-bold fs-5 py-3">🎲 요트 다이스 싱글 플레이 규칙</Card.Header>
                <Card.Body className="p-4">
                    <ListGroup variant="flush" className="fs-5">
                        <ListGroup.Item className="py-3">
                            <strong>1. 주사위 굴리기:</strong> [주사위 굴리기] 버튼을 눌러 게임을 시작합니다. 주사위는 한 턴에 최대 <strong>3번</strong>까지 굴릴 수 있습니다.
                        </ListGroup.Item>
                        <ListGroup.Item className="py-3">
                            <strong>2. 주사위 보관(Keep):</strong> 원하는 주사위를 클릭하면 아래 [보관함]으로 이동하며, 다음 주사위를 굴릴 때 값이 고정됩니다. 다시 클릭하면 필드로 되돌릴 수 있습니다.
                        </ListGroup.Item>
                        <ListGroup.Item className="py-3">
                            <strong>3. 점수 기록:</strong> 굴리기가 끝나면 우측 점수판에 초록색으로 나타나는 <strong>예상 점수</strong> 중 원하는 항목을 클릭하여 점수를 확정합니다.
                        </ListGroup.Item>
                        <ListGroup.Item className="py-3">
                            <strong>4. 주의 사항:</strong> 조건에 맞지 않는 칸에 기록하면 <strong>0점</strong>으로 처리되므로 신중하게 선택해야 합니다. 모든 칸(10개)을 채우면 게임이 끝나고 최종 점수가 기록실에 저장됩니다!
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RulesPage;