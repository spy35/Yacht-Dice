// src/components/TutorialModal.tsx
import { useState } from 'react';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import Die from './Die';

type TutorialModalProps = {
    show: boolean;
    onHide: () => void;
};

// 튜토리얼 각 단계에 사용될 상수 데이터 (랜덤 통제 및 데이터 시각화 정석)
const TUTORIAL_STEPS = [
    {
        step: 1,
        title: "🥇 1단계: 주사위 굴리기 및 보관(Keep)법",
        description: "주사위는 턴마다 최대 3번까지 굴릴 수 있습니다. 주사위를 무작위로 굴린 후, 남겨두고 싶은 주사위를 클릭하면 아래 [보관함]으로 고정되어 다음 굴리기에서 값이 유지됩니다. 아래 예시는 6번 눈금 2개를 보관(Keep)한 상태입니다.",
        dice: [
            { id: 1, value: 1, isKept: false },
            { id: 2, value: 3, isKept: false },
            { id: 3, value: 4, isKept: false },
            { id: 4, value: 6, isKept: true },
            { id: 5, value: 6, isKept: true }
        ],
        highlightCategory: ""
    },
    {
        step: 2,
        title: "🥈 2단계: 기본 눈금 점수판 매기기",
        description: "주사위 조작이 완료되면 눈금에 맞춰 점수판 항목에 기록합니다. 아래 예시는 4가 3개 나온 상황입니다. 이때 'Fours' 항목을 선택하면 4 × 3 = 12점을 획득하거나, 모든 눈금의 총합을 주는 'Choice' 칸에 기록해 19점을 얻을 수도 있습니다.",
        dice: [
            { id: 1, value: 4, isKept: false },
            { id: 2, value: 4, isKept: false },
            { id: 3, value: 4, isKept: false },
            { id: 4, value: 2, isKept: false },
            { id: 5, value: 5, isKept: false }
        ],
        highlightCategory: "fours"
    },
    {
        step: 3,
        title: "🥉 3단계: 특수 족보 - Full House (풀하우스)",
        description: "요트 다이스에는 고유의 특수 족보들이 있습니다. 'Full House'는 주사위 중 3개의 눈금이 같고, 나머지 2개의 눈금이 서로 같을 때 완성됩니다. 달성 시 주사위 5개 눈금의 총합이 최종 점수로 기록됩니다.",
        dice: [
            { id: 1, value: 3, isKept: false },
            { id: 2, value: 3, isKept: false },
            { id: 3, value: 3, isKept: false },
            { id: 4, value: 5, isKept: false },
            { id: 5, value: 5, isKept: false }
        ],
        highlightCategory: "fullHouse"
    },
    {
        step: 4,
        title: "📜 4단계: 특수 족보 - Straight (스트레이트)",
        description: "5개의 주사위 눈금이 끊기지 않고 차례대로 정렬되어 이어지는 경우(1-2-3-4-5 혹은 2-3-4-5-6) 'Straight' 족보가 완성됩니다. 스트레이트는 주사위 눈금 합산이 아닌 무조건 고정 점수 '30점'을 주는 아주 강력한 족보입니다.",
        dice: [
            { id: 1, value: 1, isKept: false },
            { id: 2, value: 2, isKept: false },
            { id: 3, value: 3, isKept: false },
            { id: 4, value: 4, isKept: false },
            { id: 5, value: 5, isKept: false }
        ],
        highlightCategory: "straight"
    },
    {
        step: 5,
        title: "🎉 5단계: 게임의 꽃 - Yacht (요트!)",
        description: "5개의 주사위 눈금이 모두 일치하는 대기록을 세웠을 때, 이 게임의 이름이자 최고 고정 점수인 'Yacht (50점)'를 달성하게 됩니다! 주사위 눈금 숫자와 상관없이 무조건 50점을 부여받는 일발 역전 카드입니다.",
        dice: [
            { id: 1, value: 6, isKept: true },
            { id: 2, value: 6, isKept: true },
            { id: 3, value: 6, isKept: true },
            { id: 4, value: 6, isKept: true },
            { id: 5, value: 6, isKept: true }
        ],
        highlightCategory: "yacht"
    }
];

const TutorialModal = ({ show, onHide }: TutorialModalProps) => {
    const [stepIndex, setStepIndex] = useState<number>(0);
    const currentData = TUTORIAL_STEPS[stepIndex];

    const handleNext = () => {
        if (stepIndex < TUTORIAL_STEPS.length - 1) {
            setStepIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (stepIndex > 0) {
            setStepIndex(prev => prev - 1);
        }
    };

    const handleClose = () => {
        setStepIndex(0); // 닫을 때 다시 1단계로 리셋
        onHide();
    };

    // 2단계 가상 점수 예시용 헬퍼 함수
    const getSampleScoreText = (catId: string) => {
        if (stepIndex === 1) { // 2단계
            if (catId === 'fours') return <span className="text-success fw-bold">12 점 (예시 추천)</span>;
            if (catId === 'choice') return <span className="text-success fw-bold">19 점</span>;
        }
        if (stepIndex === 2 && catId === 'fullHouse') return <span className="text-success fw-bold">19 점 (완성!)</span>;
        if (stepIndex === 3 && catId === 'straight') return <span className="text-success fw-bold">30 점 (완성!)</span>;
        if (stepIndex === 4 && catId === 'yacht') return <span className="text-success fw-bold">50 점 (대박!)</span>;
        return "-";
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title className="fw-bold">📖 인터랙티브 대화형 튜토리얼</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4" style={{ backgroundColor: '#fcfcfc' }}>
                <h4 className="text-dark fw-bold mb-3">{currentData.title}</h4>
                <p className="fs-5 text-secondary mb-4" style={{ lineHeight: '1.6' }}>
                    {currentData.description}
                </p>

                {/* ⭐️ 컴포넌트 재사용 구간 1: 주사위 시각 자료 배치 */}
                <div className="bg-white p-3 rounded border text-center mb-4 shadow-sm">
                    <h6 className="text-muted fw-bold mb-3">🎲 현재 가상 주사위 필드 및 보관 상태</h6>
                    <div className="d-flex justify-content-center align-items-center flex-wrap">
                        {currentData.dice.map(d => (
                            <Die key={d.id} die={d} size="70px" />
                        ))}
                    </div>
                </div>

                {/* ⭐️ 컴포넌트 재사용 구간 2: 점수판 표 가상 매칭 */}
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
                                const isTarget = item.id === currentData.highlightCategory;
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
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between bg-light">
                <div className="text-muted fw-bold">
                    {stepIndex + 1} / {TUTORIAL_STEPS.length} 단계
                </div>
                <div>
                    <Button variant="secondary" onClick={handlePrev} disabled={stepIndex === 0} className="me-2 fw-bold">
                        이전 단계
                    </Button>
                    {stepIndex < TUTORIAL_STEPS.length - 1 ? (
                        <Button variant="primary" onClick={handleNext} className="fw-bold">
                            다음 단계
                        </Button>
                    ) : (
                        <Button variant="success" onClick={handleClose} className="fw-bold">
                            튜토리얼 완료 👍
                        </Button>
                    )}
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default TutorialModal;