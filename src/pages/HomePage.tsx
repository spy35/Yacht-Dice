// src/pages/HomePage.tsx
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

type HomePageProps = {
    onSelectGame: (game: 'yacht' | 'duel') => void;
};

const HomePage = ({ onSelectGame }: HomePageProps) => {
    return (
        <Container className="py-5 text-center" style={{ maxWidth: '900px' }}>
            <h1 className="display-4 fw-bold text-dark mb-3">DICE GAME HUB</h1>
            <p className="lead text-muted mb-5">원하는 주사위 게임을 선택하여 플레이해 보세요!</p>
            
            <Row className="g-4 justify-content-center">
                {/* 카드 1: 요트 다이스 */}
                <Col md={5}>
                    <Card className="h-100 border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: '15px' }}>
                        <Card.Body className="d-flex flex-column p-4">
                            <div className="display-1 my-3">🎲</div>
                            <Card.Title className="fw-bold fs-3 mb-2">요트 다이스</Card.Title>
                            <Card.Text className="text-secondary flex-grow-1">
                                5개의 주사위를 굴리고 보관하여 전략적으로 최고의 족보 조합을 맞춰 최고 점수를 경신하는 1인용 보드게임입니다.
                            </Card.Text>
                            <Button 
                                variant="primary" 
                                size="lg" 
                                className="w-100 fw-bold mt-3" 
                                style={{ borderRadius: '10px' }}
                                onClick={() => onSelectGame('yacht')}
                            >
                                게임 입장하기
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 카드 2: 다이스 듀얼 */}
                <Col md={5}>
                    <Card className="h-100 border-0 shadow-sm hover-shadow transition-all" style={{ borderRadius: '15px' }}>
                        <Card.Body className="d-flex flex-column p-4">
                            <div className="display-1 my-3">⚔️</div>
                            <Card.Title className="fw-bold fs-3 mb-2">다이스 듀얼</Card.Title>
                            <Card.Text className="text-secondary flex-grow-1">
                                컴퓨터 AI와 대결하는 짜릿한 주사위 한판 승부! 각각 3개의 주사위를 굴려 총합 눈금이 더 높은 쪽이 승리합니다.
                            </Card.Text>
                            <Button 
                                variant="danger" 
                                size="lg" 
                                className="w-100 fw-bold mt-3" 
                                style={{ borderRadius: '10px' }}
                                onClick={() => onSelectGame('duel')}
                            >
                                대결 시작하기
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;