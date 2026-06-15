// src/pages/DuelPage.tsx
import { useState } from 'react';
import { Container, Card, Row, Col, Button, Alert } from 'react-bootstrap';
import Die from '../components/Die';
import type { DuelRecord } from '../types/game';

type DuelPageProps = {
    onBack: () => void; // 메인 로비로 돌아가는 함수, 플레이어가 "메인 로비로 가기" 버튼을 클릭할 때 호출되어 게임 페이지에서 메인 로비로 이동하는 등의 UI 로직이 실행됨
    onSaveRecord: (record: DuelRecord) => void; // 듀얼 결과 기록을 저장하는 함수, 플레이어가 주사위를 굴려 승패가 결정된 후에 호출되어 해당 결과를 DuelRecord 형태로 저장하는 로직이 실행됨 (예: 로컬 스토리지에 저장하거나 상위 컴포넌트로 전달하여 기록 목록에 추가하는 등의 방식으로 구현될 수 있음)
};

const DuelPage = ({ onBack, onSaveRecord }: DuelPageProps) => { // DuelPage 컴포넌트 정의, props로 메인 로비로 돌아가는 함수와 듀얼 결과를 저장하는 함수를 받아옴
    const [playerDice, setPlayerDice] = useState<number[]>([1, 1, 1]);
    const [computerDice, setComputerDice] = useState<number[]>([1, 1, 1]);
    const [isRolled, setIsRolled] = useState<boolean>(false); // 주사위를 굴렸는지 여부를 나타내는 상태, 초기값은 false로 설정되어 있으며 플레이어가 "주사위 격돌!" 버튼을 클릭하여 주사위를 굴리면 true로 변경되고 결과 메시지가 표시되는 등의 UI 로직이 실행됨
    const [resultMessage, setResultResult] = useState<string>(''); // 듀얼 결과 메시지를 저장하는 상태, 초기값은 빈 문자열로 설정되어 있으며 플레이어가 주사위를 굴려 승패가 결정된 후에 해당 결과에 맞는 메시지로 업데이트되고 Alert 컴포넌트에서 보여지는 등의 UI 로직이 실행됨
    const [alertVariant, setAlertVariant] = useState<string>('info'); // Alert 컴포넌트의 스타일을 결정하는 상태, 초기값은 'info'로 설정되어 있으며 플레이어가 주사위를 굴려 승패가 결정된 후에 승리면 'success', 패배면 'danger', 무승부면 'warning'으로 업데이트되고 Alert 컴포넌트의 색상과 아이콘이 변경되는 등의 UI 로직이 실행됨

    const playDuel = () => { // 주사위를 굴려서 듀얼을 진행하는 함수, 플레이어가 "주사위 격돌!" 버튼을 클릭할 때 호출되어 랜덤한 주사위 값을 생성하고 승패를 결정하는 로직이 실행됨
        const pDice = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);
        const cDice = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);

        setPlayerDice(pDice); // 플레이어 주사위 상태 업데이트, 랜덤하게 생성된 pDice 배열로 playerDice 상태를 업데이트하여 UI에 반영하는 로직이 실행됨
        setComputerDice(cDice); // 컴퓨터 주사위 상태 업데이트, 랜덤하게 생성된 cDice 배열로 computerDice 상태를 업데이트하여 UI에 반영하는 로직이 실행됨
        setIsRolled(true); // 주사위를 굴렸다는 상태 업데이트, true로 설정하여 결과 메시지가 표시되는 등의 UI 로직이 실행됨

        const pSum = pDice.reduce((a, b) => a + b, 0); // 플레이어 주사위 총합 계산, pDice 배열의 모든 요소를 더하여 플레이어의 총합을 계산하는 로직이 실행됨
        const cSum = cDice.reduce((a, b) => a + b, 0); // 컴퓨터 주사위 총합 계산, cDice 배열의 모든 요소를 더하여 컴퓨터의 총합을 계산하는 로직이 실행됨

        let finalResult: 'WIN' | 'LOSE' | 'DRAW' = 'DRAW'; // 최종 결과를 저장하는 변수, 초기값은 'DRAW'로 설정되어 있으며 플레이어 총합과 컴퓨터 총합을 비교하여 승리면 'WIN', 패배면 'LOSE', 무승부면 'DRAW'로 업데이트되는 로직이 실행됨

        if (pSum > cSum) { // 승리 결정 로직, 플레이어 총합이 컴퓨터 총합보다 높으면 승리 메시지를 설정하고 Alert 스타일을 'success'로 변경하며 최종 결과를 'WIN'으로 설정하는 로직이 실행됨
            setResultResult(`🎉 승리! 플레이어 총합(${pSum}점)이 컴퓨터(${cSum}점)를 이겼습니다!`);
            setAlertVariant('success');
            finalResult = 'WIN';
        } else if (pSum < cSum) { // 패배 결정 로직, 플레이어 총합이 컴퓨터 총합보다 낮으면 패배 메시지를 설정하고 Alert 스타일을 'danger'로 변경하며 최종 결과를 'LOSE'로 설정하는 로직이 실행됨
            setResultResult(`😭 패배... 컴퓨터 총합(${cSum}점)이 플레이어(${pSum}점)보다 높습니다.`);
            setAlertVariant('danger');
            finalResult = 'LOSE';
        } else { // 무승부 결정 로직, 플레이어 총합과 컴퓨터 총합이 같으면 무승부 메시지를 설정하고 Alert 스타일을 'warning'로 변경하며 최종 결과를 'DRAW'로 설정하는 로직이 실행됨
            setResultResult(`🤝 무승부! 플레이어와 컴퓨터 모두 ${pSum}점으로 동점입니다.`);
            setAlertVariant('warning');
            finalResult = 'DRAW';
        }

        const newDuelRecord: DuelRecord = { // 새로운 듀얼 기록 객체 생성, 현재 날짜와 시간, 플레이어와 컴퓨터의 주사위 값과 총합, 그리고 최종 결과를 포함하는 DuelRecord 형태의 객체를 생성하는 로직이 실행됨
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

export default DuelPage;