// src/components/TutorialModal.tsx
import { useState, useEffect } from 'react';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import Die from './Die';

type TutorialModalProps = {
    show: boolean;
    onHide: () => void;
    gameType: 'yacht' | 'duel';
};

// 1. 요트 다이스 튜토리얼 데이터
const YACHT_STEPS = [
    {
        step: 1,
        title: "🎲 요트 단계 1: 주사위 굴리기 및 보관(Keep)법",
        description: "주사위는 한 턴에 최대 3번까지 굴릴 수 있습니다. 남겨두고 싶은 주사위를 클릭하면 [보관함]으로 고정되어 다음 굴리기에서 값이 유지됩니다. 아래 예시는 6번 눈금 2개를 보관(Keep)한 상태입니다.",
        dice: [
            { id: 1, value: 1, isKept: false }, { id: 2, value: 3, isKept: false }, { id: 3, value: 4, isKept: false },
            { id: 4, value: 6, isKept: true }, { id: 5, value: 6, isKept: true }
        ],
        highlightCategory: ""
    },
    {
        step: 2,
        title: "🎲 요트 단계 2: 기본 눈금 점수판 매기기",
        description: "주사위 조작이 완료되면 눈금에 맞춰 점수판 항목에 기록합니다. 아래 예시는 4가 3개 나온 상황입니다. 이때 'Fours' 항목을 선택하면 12점을 획득하거나, 모든 눈금의 총합을 주는 'Choice' 칸에 기록해 19점을 얻을 수도 있습니다.",
        dice: [
            { id: 1, value: 4, isKept: false }, { id: 2, value: 4, isKept: false }, { id: 3, value: 4, isKept: false },
            { id: 4, value: 2, isKept: false }, { id: 5, value: 5, isKept: false }
        ],
        highlightCategory: "fours"
    },
    {
        step: 3,
        title: "🎲 요트 단계 3: 특수 족보 - Full House (풀하우스)",
        description: "주사위 중 3개의 눈금이 같고, 나머지 2개의 눈금이 서로 같을 때 완성됩니다. 달성 시 주사위 5개 눈금의 총합이 최종 점수로 기록됩니다.",
        dice: [
            { id: 1, value: 3, isKept: false }, { id: 2, value: 3, isKept: false }, { id: 3, value: 3, isKept: false },
            { id: 4, value: 5, isKept: false }, { id: 5, value: 5, isKept: false }
        ],
        highlightCategory: "fullHouse"
    },
    {
        step: 4,
        title: "🎲 요트 단계 4: 특수 족보 - Straight (스트레이트)",
        description: "5개의 주사위 눈금이 끊기지 않고 차례대로 이어지는 경우(1-2-3-4-5 혹은 2-3-4-5-6) 'Straight' 족보가 완성됩니다. 무조건 고정 점수 '30점'을 주는 강력한 족보입니다.",
        dice: [
            { id: 1, value: 1, isKept: false }, { id: 2, value: 2, isKept: false }, { id: 3, value: 3, isKept: false },
            { id: 4, value: 4, isKept: false }, { id: 5, value: 5, isKept: false }
        ],
        highlightCategory: "straight"
    },
    {
        step: 5,
        title: "🎲 요트 단계 5: 게임의 꽃 - Yacht (요트!)",
        description: "5개의 주사위 눈금이 모두 일치하는 대기록을 세웠을 때 최고 고정 점수인 'Yacht (50점)'를 달성하게 됩니다! 일발 역전 카드입니다.",
        dice: [
            { id: 1, value: 6, isKept: true }, { id: 2, value: 6, isKept: true }, { id: 3, value: 6, isKept: true },
            { id: 4, value: 6, isKept: true }, { id: 5, value: 6, isKept: true }
        ],
        highlightCategory: "yacht"
    }
];

// 2. ⭐️ 수정됨: 다이스 듀얼 튜토리얼 데이터 (결과별 세분화)
const DUEL_STEPS = [
    {
        step: 1,
        title: "⚔️ 듀얼 단계 1: 다이스 듀얼 개요",
        description: "다이스 듀얼은 컴퓨터 AI와 플레이어가 각각 3개의 주사위를 던져 총합 눈금이 더 높은 쪽이 매치에서 승리하는 초직관적 배틀 게임 모드입니다.",
        playerDice: [1, 1, 1],
        computerDice: [1, 1, 1],
        result: ""
    },
    {
        step: 2,
        title: "⚔️ 듀얼 단계 2: 주사위 격돌 배틀 진행",
        description: "하단의 [주사위 격돌!] 버튼을 누르면 양 진영의 주사위 3개가 동시에 무작위 회전합니다. 각 주사위의 순수 눈금 합산 연산이 실시간 카드 하단에 스냅샷 점수로 누적 표기됩니다.",
        playerDice: [5, 2, 4], // 합: 11
        computerDice: [3, 6, 1], // 합: 10
        result: "" // 단순 진행 설명이므로 배지 숨김
    },
    {
        step: 3,
        title: "🏆 듀얼 단계 3: 승리 (WIN) 판정",
        description: "플레이어의 주사위 눈금 총합이 컴퓨터의 총합보다 높으면 플레이어의 '승리(WIN)'로 기록됩니다. 아래 예시는 16 대 10으로 승리한 짜릿한 상황입니다.",
        playerDice: [6, 6, 4], // 합: 16
        computerDice: [2, 3, 5], // 합: 10
        result: "WIN"
    },
    {
        step: 4,
        title: "😭 듀얼 단계 4: 패배 (LOSE) 판정",
        description: "반대로 컴퓨터의 주사위 눈금 총합이 플레이어의 총합보다 높으면 '패배(LOSE)'하게 됩니다. 아래 예시는 6 대 14로 아쉽게 패배한 상황입니다.",
        playerDice: [1, 2, 3], // 합: 6
        computerDice: [5, 5, 4], // 합: 14
        result: "LOSE"
    },
    {
        step: 5,
        title: "🤝 듀얼 단계 5: 무승부 (DRAW) 판정",
        description: "양 진영의 주사위 총합이 완벽하게 동일한 눈금으로 일치할 경우 '무승부(DRAW)'로 전적에 기록됩니다. 아래 예시는 12 대 12로 동점인 상황입니다.",
        playerDice: [3, 4, 5], // 합: 12
        computerDice: [6, 4, 2], // 합: 12
        result: "DRAW"
    }
];

const TutorialModal = ({ show, onHide, gameType }: TutorialModalProps) => {
    const [stepIndex, setStepIndex] = useState<number>(0);
    
    useEffect(() => {
        setStepIndex(0);
    }, [show, gameType]);

    const stepsData = gameType === 'yacht' ? YACHT_STEPS : DUEL_STEPS;
    const currentData = stepsData[stepIndex];

    const handleNext = () => {
        if (stepIndex < stepsData.length - 1) setStepIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (stepIndex > 0) setStepIndex(prev => prev - 1);
    };

    const handleClose = () => {
        setStepIndex(0);
        onHide();
    };

    // 요트 다이스용 예상 점수 반환 함수
    const getSampleScoreText = (catId: string) => {
        if (stepIndex === 1) {
            if (catId === 'fours') return <span className="text-success fw-bold">12 점 (예시 추천)</span>;
            if (catId === 'choice') return <span className="text-success fw-bold">19 점</span>;
        }
        if (stepIndex === 2 && catId === 'fullHouse') return <span className="text-success fw-bold">19 점 (완성!)</span>;
        if (stepIndex === 3 && catId === 'straight') return <span className="text-success fw-bold">30 점 (완성!)</span>;
        if (stepIndex === 4 && catId === 'yacht') return <span className="text-success fw-bold">50 점 (대박!)</span>;
        return "-";
    };

    // ⭐️ 추가됨: 다이스 듀얼용 결과 배지 동적 렌더링 함수
    const renderDuelBadge = (result: string) => {
        if (result === 'WIN') return <Badge bg="success" className="fs-5 py-2 px-4 shadow-sm">🏆 위 예시는 플레이어의 승리 (WIN)!</Badge>;
        if (result === 'LOSE') return <Badge bg="danger" className="fs-5 py-2 px-4 shadow-sm">😭 위 예시는 컴퓨터의 승리 (LOSE)...</Badge>;
        if (result === 'DRAW') return <Badge bg="warning" className="fs-5 py-2 px-4 shadow-sm text-dark">🤝 위 예시는 무승부 (DRAW)!</Badge>;
        return null;
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
            <Modal.Header closeButton className={gameType === 'yacht' ? "bg-primary text-white" : "bg-danger text-white"}>
                <Modal.Title className="fw-bold">
                    📖 {gameType === 'yacht' ? '요트 다이스 가이드라인' : '다이스 듀얼 가이드라인'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4" style={{ backgroundColor: '#fcfcfc' }}>
                <h4 className="text-dark fw-bold mb-3">{currentData.title}</h4>
                <p className="fs-5 text-secondary mb-4" style={{ lineHeight: '1.6' }}>
                    {currentData.description}
                </p>

                {/* 요트 다이스 렌더링 레이아웃 */}
                {gameType === 'yacht' && 'dice' in currentData && (
                    <>
                        <div className="bg-white p-3 rounded border text-center mb-4 shadow-sm">
                            <h6 className="text-muted fw-bold mb-3">🎲 현재 가상 주사위 필드 및 보관 상태</h6>
                            <div className="d-flex justify-content-center align-items-center flex-wrap">
                                {currentData.dice.map((d: any) => (
                                    <Die key={d.id} die={d} size="70px" />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-3 rounded border shadow-sm" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                            <h6 className="text-muted fw-bold mb-2">📊 스코어보드 연동 예시</h6>
                            <Table bordered size="sm" className="text-center align-middle mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th>족보 템플릿</th>
                                        <th>예상 계산 스코어</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { id: 'fours', name: 'Fours (4의 눈금)' },
                                        { id: 'choice', name: 'Choice (초이스)' },
                                        { id: 'fullHouse', name: 'Full House (풀하우스)' },
                                        { id: 'straight', name: 'Straight (스트레이트)' },
                                        { id: 'yacht', name: 'Yacht (요트!)' }
                                    ].map(item => {
                                        const isTarget = item.id === (currentData as any).highlightCategory;
                                        return (
                                            <tr key={item.id} style={{ backgroundColor: isTarget ? '#e2f0d9' : 'transparent' }}>
                                                <td className="p-2 fw-bold">
                                                    {item.name} {isTarget && <Badge bg="danger" className="ms-1">집중 안내</Badge>}
                                                </td>
                                                <td className="p-2">{getSampleScoreText(item.id)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </>
                )}

                {/* 다이스 듀얼 렌더링 레이아웃 */}
                {gameType === 'duel' && 'playerDice' in currentData && (
                    <div className="bg-white p-4 rounded border shadow-sm">
                        <div className="d-flex justify-content-around align-items-center flex-wrap gap-3">
                            {/* 플레이어 진영 예시 */}
                            <div className="border p-2 rounded text-center bg-light" style={{minWidth:'180px'}}>
                                <small className="fw-bold text-primary">USER</small>
                                <div className="d-flex justify-content-center my-2">
                                    {(currentData as any).playerDice.map((v: number, i: number) => (
                                        <Die key={i} die={{ value: v }} size="45px" />
                                    ))}
                                </div>
                            </div>
                            <div className="fs-3 fw-bold text-muted">VS</div>
                            {/* 컴퓨터 진영 예시 */}
                            <div className="border p-2 rounded text-center bg-light" style={{minWidth:'180px'}}>
                                <small className="fw-bold text-secondary">COM AI</small>
                                <div className="d-flex justify-content-center my-2">
                                    {(currentData as any).computerDice.map((v: number, i: number) => (
                                        <Die key={i} die={{ value: v }} size="45px" />
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* ⭐️ 동적으로 생성되는 결과 배지 노출 */}
                        {(currentData as any).result && (
                            <div className="mt-4 text-center">
                                {renderDuelBadge((currentData as any).result)}
                            </div>
                        )}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between bg-light">
                <div className="text-muted fw-bold">
                    {stepIndex + 1} / {stepsData.length} 단계
                </div>
                <div>
                    <Button variant="secondary" onClick={handlePrev} disabled={stepIndex === 0} className="me-2 fw-bold">
                        이전
                    </Button>
                    {stepIndex < stepsData.length - 1 ? (
                        <Button variant="primary" onClick={handleNext} className="fw-bold">
                            다음
                        </Button>
                    ) : (
                        <Button variant="success" onClick={handleClose} className="fw-bold">
                            가이드 이해 완료 👍
                        </Button>
                    )}
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default TutorialModal;