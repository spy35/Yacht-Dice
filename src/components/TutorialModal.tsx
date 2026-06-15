// src/components/TutorialModal.tsx
import { useState, useEffect } from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import Die from './Die';
import ScoreBoard from './ScoreBoard';
import DiceBoard from './DiceBoard';
import type { CategoryType } from '../types/game';

type TutorialModalProps = {
    show: boolean;
    onHide: () => void;
    gameType: 'yacht' | 'duel';
};

// 헬퍼 함수: 10가지 기본 카테고리 틀을 만들어주는 함수
const createMockCategories = (targetId?: string, targetScore?: number): CategoryType[] => {
    // 1. base 배열 자체가 CategoryType[] 임을 명시해줍니다.
    const base: CategoryType[] = [
        { id: 'aces', name: 'Aces (1의 눈금)', score: null },
        { id: 'twos', name: 'Twos (2의 눈금)', score: null },
        { id: 'threes', name: 'Threes (3의 눈금)', score: null },
        { id: 'fours', name: 'Fours (4의 눈금)', score: null },
        { id: 'fives', name: 'Fives (5의 눈금)', score: null },
        { id: 'sixes', name: 'Sixes (6의 눈금)', score: null },
        { id: 'choice', name: 'Choice (초이스)', score: null },
        { id: 'fullHouse', name: 'Full House (풀하우스)', score: null },
        { id: 'straight', name: 'Straight (스트레이트)', score: null },
        { id: 'yacht', name: 'Yacht (요트!)', score: null },
    ];
    
    // 2. targetScore가 undefined일 경우 null을 반환하도록 (?? null) 처리합니다.
    return base.map(cat => 
        cat.id === targetId 
            ? { ...cat, score: targetScore ?? null } 
            : cat
    );
};

// 1. 요트 다이스 튜토리얼 데이터 (Yacht Dice)
const YACHT_STEPS = [
    {
        step: 1,
        title: "🎲 요트 단계 1: 주사위 굴리기 및 보관(Keep)법",
        description: "주사위는 한 턴에 최대 3번까지 굴릴 수 있습니다. 남겨두고 싶은 주사위를 클릭하면 [보관함]으로 고정되어 다음 굴리기에서 값이 유지됩니다. 아래 예시는 6번 눈금 2개를 보관(Keep)한 상태입니다.",
        dice: [
            { id: 1, value: 1, isKept: false }, { id: 2, value: 3, isKept: false }, { id: 3, value: 4, isKept: false },
            { id: 4, value: 6, isKept: true }, { id: 5, value: 6, isKept: true }
        ],
        highlightCategory: "",
        // 점수판이 비어있는 상태를 연출합니다.
        categoriesState: createMockCategories()
    },
    {
        step: 2,
        title: "🎲 요트 단계 2: 기본 눈금 점수판 매기기",
        description: "주사위 조작이 완료되면 눈금에 맞춰 점수판 항목에 기록합니다. 아래 예시는 4가 3개 나온 상황입니다. 이때 'Fours' 항목을 선택하면 눈금의 합산인 12점을 획득하며 점수판에 영구 박제(LOCK)됩니다.",
        dice: [
            { id: 1, value: 4, isKept: false }, { id: 2, value: 4, isKept: false }, { id: 3, value: 4, isKept: false },
            { id: 2, value: 2, isKept: false }, { id: 5, value: 5, isKept: false }
        ],
        highlightCategory: "fours",
        // Fours 칸에 가상의 12점을 채운 스냅샷을 만듭니다.
        categoriesState: createMockCategories('fours', 12)
    },
    {
        step: 3,
        title: "🎲 요트 단계 3: 특수 족보 - Full House (풀하우스)",
        description: "주사위 중 3개의 눈금이 같고, 나머지 2개의 눈금이 서로 같을 때 완성됩니다. 달성 시 주사위 5개 눈금의 총합(여기서는 3+3+3+5+5 = 19점)이 최종 점수로 기록됩니다.",
        dice: [
            { id: 1, value: 3, isKept: false }, { id: 2, value: 3, isKept: false }, { id: 3, value: 3, isKept: false },
            { id: 4, value: 5, isKept: false }, { id: 5, value: 5, isKept: false }
        ],
        highlightCategory: "fullHouse",
        categoriesState: createMockCategories('fullHouse', 19)
    },
    {
        step: 4,
        title: "🎲 요트 단계 4: 특수 족보 - Straight (스트레이트)",
        description: "5개의 주사위 눈금이 끊기지 않고 차례대로 이어지는 경우(1-2-3-4-5 혹은 2-3-4-5-6) 'Straight' 족보가 완성됩니다. 무조건 고정 점수 '30점'을 주는 강력한 족보입니다.",
        dice: [
            { id: 1, value: 1, isKept: false }, { id: 2, value: 2, isKept: false }, { id: 3, value: 3, isKept: false },
            { id: 4, value: 4, isKept: false }, { id: 5, value: 5, isKept: false }
        ],
        highlightCategory: "straight",
        categoriesState: createMockCategories('straight', 30)
    },
    {
        step: 5,
        title: "🎲 요트 단계 5: 게임의 꽃 - Yacht (요트!)",
        description: "5개의 주사위 눈금이 모두 일치하는 대기록을 세웠을 때 최고 고정 점수인 'Yacht (50점)'를 달성하게 됩니다! 일발 역전 카드입니다.",
        dice: [
            { id: 1, value: 6, isKept: true }, { id: 2, value: 6, isKept: true }, { id: 3, value: 6, isKept: true },
            { id: 4, value: 6, isKept: true }, { id: 5, value: 6, isKept: true }
        ],
        highlightCategory: "yacht",
        categoriesState: createMockCategories('yacht', 50)
    }
];

// 2. 다이스 듀얼 튜토리얼 데이터 (Dice Duel)
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
        playerDice: [5, 2, 4], 
        computerDice: [3, 6, 1], 
        result: "" 
    },
    {
        step: 3,
        title: "🏆 듀얼 단계 3: 승리 (WIN) 판정",
        description: "플레이어의 주사위 눈금 총합이 컴퓨터의 총합보다 높으면 플레이어의 '승리(WIN)'로 기록됩니다. 아래 예시는 16 대 10으로 승리한 짜릿한 상황입니다.",
        playerDice: [6, 6, 4], 
        computerDice: [2, 3, 5], 
        result: "WIN"
    },
    {
        step: 4,
        title: "😭 듀얼 단계 4: 패배 (LOSE) 판정",
        description: "반대로 컴퓨터의 주사위 눈금 총합이 플레이어의 총합보다 높으면 '패배(LOSE)'하게 됩니다. 아래 예시는 6 대 14로 아쉽게 패배한 상황입니다.",
        playerDice: [1, 2, 3], 
        computerDice: [5, 5, 4], 
        result: "LOSE"
    },
    {
        step: 5,
        title: "🤝 듀얼 단계 5: 무승부 (DRAW) 판정",
        description: "양 진영의 주사위 총합이 완벽하게 동일한 눈금으로 일치할 경우 '무승부(DRAW)'로 전적에 기록됩니다. 아래 예시는 12 대 12로 동점인 상황입니다.",
        playerDice: [3, 4, 5], 
        computerDice: [6, 4, 2], 
        result: "DRAW"
    }
];

const TutorialModal = ({ show, onHide, gameType }: TutorialModalProps) => {
    const [stepIndex, setStepIndex] = useState<number>(0);
    
    useEffect(() => {
        setStepIndex(0);
    }, [show, gameType]);

    const stepsData = gameType === 'yacht' ? YACHT_STEPS : DUEL_STEPS;
    const currentData = stepsData[stepIndex] as any;

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

                {/* 요트 다이스 레이아웃 */}
                {gameType === 'yacht' && currentData.dice && (
                    <Row className="align-items-start g-3">
                        {/* 왼쪽 열: 주사위 필드 */}
                {gameType === 'yacht' && currentData.dice && (
                    <Row className="align-items-start g-3">
                        <Col md={5}>
                            <DiceBoard 
                                dice={currentData.dice} 
                                rollsLeft={0} 
                                isReadOnly={true} // 읽기 모드 ON (버튼 숨김)
                            />
                        </Col>

                        {/* 오른쪽 열: ScoreBoard 재사용 */}
                        <Col md={7}>
                            <div className="shadow-sm rounded border overflow-hidden">
                                <ScoreBoard 
                                    categories={currentData.categoriesState}
                                    dice={currentData.dice} 
                                    rollsLeft={0} 
                                    selectCategory={() => null} 
                                    isReviewMode={true}        
                                    highlightedCategory={currentData.highlightCategory} 
                                />
                            </div>
                        </Col>
                    </Row>
                )}
                    </Row>
                )}

                {/* ⚔️ 다이스 듀얼 렌더링 레이아웃 */}
                {gameType === 'duel' && currentData.playerDice && (
                    <div className="bg-white p-4 rounded border shadow-sm">
                        <div className="d-flex justify-content-around align-items-center flex-wrap gap-3">
                            <div className="border p-2 rounded text-center bg-light" style={{minWidth:'180px'}}>
                                <small className="fw-bold text-primary">USER</small>
                                <div className="d-flex justify-content-center my-2">
                                    {currentData.playerDice.map((v: number, i: number) => (
                                        <Die key={i} die={{ value: v }} size="45px" />
                                    ))}
                                </div>
                            </div>
                            <div className="fs-3 fw-bold text-muted">VS</div>
                            <div className="border p-2 rounded text-center bg-light" style={{minWidth:'180px'}}>
                                <small className="fw-bold text-secondary">COM AI</small>
                                <div className="d-flex justify-content-center my-2">
                                    {currentData.computerDice.map((v: number, i: number) => (
                                        <Die key={i} die={{ value: v }} size="45px" />
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {currentData.result && (
                            <div className="mt-4 text-center">
                                {renderDuelBadge(currentData.result)}
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