// src/components/DiceDuel.tsx
import { useState } from 'react';
import { Container, Card, Row, Col, Button, Alert } from 'react-bootstrap';
import Die from './Die';
import type { DuelRecord } from '../types/game';

type DiceDuelProps = {
    onBack: () => void;
    onSaveRecord: (record: DuelRecord) => void; // ⭐️ 추가: 기록 저장 함수 수신
};

const DiceDuel = ({ onBack, onSaveRecord }: DiceDuelProps) => {
    const [playerDice, setPlayerDice] = useState<number[]>([1, 1, 1]);
    const [computerDice, setComputerDice] = useState<number[]>([1, 1, 1]);
    const [isRolled, setIsRolled] = useState<boolean>(false);
    const [resultMessage, setResultResult] = useState<string>('');
    const [alertVariant, setAlertVariant] = useState<string>('info');

    const playDuel = () => {
        const pDice = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);
        const cDice = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);

        setPlayerDice(pDice);
        setComputerDice(cDice);
        setIsRolled(true);

        const pSum = pDice.reduce((a, b) => a + b, 0);
        const cSum = cDice.reduce((a, b) => a + b, 0);

        let finalResult: 'WIN' | 'LOSE' | 'DRAW' = 'DRAW';

        if (pSum > cSum) {
            setResultResult(`🎉 승리! 플레이어 총합(${pSum}점)이 컴퓨터(${cSum}점)를 이겼습니다!`);
            setAlertVariant('success');
            finalResult = 'WIN';
        } else if (pSum < cSum) {
            setResultResult(`😭 패배... 컴퓨터 총합(${cSum}점)이 플레이어(${pSum}점)보다 높습니다.`);
            setAlertVariant('danger');
            finalResult = 'LOSE';
        } else {
            setResultResult(`🤝 무승부! 플레이어와 컴퓨터 모두 ${pSum}점으로 동점입니다.`);
            setAlertVariant('warning');
            finalResult = 'DRAW';
        }

        // ⭐️ 배틀 직후 부모 컴포넌트로 듀얼 매치 기록 전동 및 localStorage 보존 트리거
        const newDuelRecord: DuelRecord = {
            id: Date.now().toString(),
            date: new Date().toLocaleString(),
            playerSum: pSum,
            computerSum: cSum,
            playerDice: pDice,
            computerDice: cDice,
            result: finalResult
        };
        onSaveRecord(newDuelRecord);
    };

    return (
        <Container className="py-4" style={{ maxWidth: '800px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="outline-dark" onClick={onBack} className="fw-bold">
                    ← 메인 로비로 가기
                </Button>
                <h3 className="fw-bold text-dark m-0">⚔️ DICE DUEL MODE</h3>
            </div>

            <Row className="g-4 mb-4">
                <Col sm={6}>
                    <Card className="border-0 shadow-sm text-center p-3 bg-white" style={{ borderRadius: '12px' }}>
                        <Card.Header className="bg-primary text-white fw-bold py-2" style={{ borderRadius: '8px' }}>
                            👤 플레이어 (YOU)
                        </Card.Header>
                        <Card.Body className="d-flex justify-content-center align-items-center py-4" style={{ minHeight: '120px' }}>
                            {playerDice.map((val, idx) => (
                                <Die key={idx} die={{ value: val }} size="70px" />
                            ))}
                        </Card.Body>
                        <Card.Footer className="bg-transparent border-0 text-muted fw-bold">
                            총합: {playerDice.reduce((a,b)=>a+b,0)} 점
                        </Card.Footer>
                    </Card>
                </Col>

                <Col sm={6}>
                    <Card className="border-0 shadow-sm text-center p-3 bg-white" style={{ borderRadius: '12px' }}>
                        <Card.Header className="bg-secondary text-white fw-bold py-2" style={{ borderRadius: '8px' }}>
                            🤖 컴퓨터 AI
                        </Card.Header>
                        <Card.Body className="d-flex justify-content-center align-items-center py-4" style={{ minHeight: '120px' }}>
                            {computerDice.map((val, idx) => (
                                <Die key={idx} die={{ value: val }} size="70px" />
                            ))}
                        </Card.Body>
                        <Card.Footer className="bg-transparent border-0 text-muted fw-bold">
                            총합: {computerDice.reduce((a,b)=>a+b,0)} 점
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            {isRolled && (
                <Alert variant={alertVariant} className="text-center fs-5 fw-bold py-3 shadow-sm mb-4" style={{ borderRadius: '10px' }}>
                    {resultMessage}
                </Alert>
            )}

            <Button variant="danger" size="lg" className="w-100 py-3 fw-bold shadow" style={{ borderRadius: '12px' }} onClick={playDuel}>
                ⚔️ 주사위 격돌! (배틀 매치)
            </Button>
        </Container>
    );
};

export default DiceDuel;