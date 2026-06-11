// src/components/DiceBoard.tsx
import { Container, Button } from 'react-bootstrap';
import Die from './Die';
import type { DieType } from '../types/game';

type DiceBoardProps = {
    dice: DieType[];
    rollsLeft: number;
    rollDice: () => void;
    toggleKeep: (id: number) => void;
};

const DiceBoard = ({ dice, rollsLeft, rollDice, toggleKeep }: DiceBoardProps) => {
    
    // ⭐️ 핵심 로직: 전체 주사위 배열을 isKept 상태에 따라 두 그룹으로 나눕니다.
    const rollingDice = dice.filter(die => !die.isKept); // 보관 안 된 주사위
    const keptDice = dice.filter(die => die.isKept);     // 보관된 주사위

    return (
        <Container className="border p-4 rounded text-center bg-light shadow-sm">
            <h3 className="mb-1">🎲 주사위 굴리기</h3>
            <p className="text-muted fw-bold mb-4">남은 횟수: {rollsLeft}번</p>
            
            {/* 1. 필드 (굴리는 주사위 영역) */}
            <div className="mb-4 p-3 bg-white rounded border" style={{ minHeight: '140px' }}>
                <h6 className="text-secondary mb-2">필드 (Field)</h6>
                <div className="d-flex justify-content-center align-items-center flex-wrap" style={{ minHeight: '80px' }}>
                    {rollingDice.length > 0 ? (
                        rollingDice.map(die => (
                            <Die key={die.id} die={die} toggleKeep={toggleKeep} />
                        ))
                    ) : (
                        <span className="text-muted">모든 주사위를 보관했습니다.</span>
                    )}
                </div>
            </div>

            {/* 2. 보관함 (킵한 주사위 영역) */}
            {/* 배경색을 살짝 노란빛(#fff3cd)으로 주어 보관함 느낌을 강조합니다. */}
            <div className="mb-4 p-3 rounded border" style={{ minHeight: '140px', backgroundColor: '#fff3cd' }}>
                <h6 className="text-warning mb-2" style={{ fontWeight: 'bold' }}>보관함 (Keep)</h6>
                <div className="d-flex justify-content-center align-items-center flex-wrap" style={{ minHeight: '80px' }}>
                    {keptDice.length > 0 ? (
                        keptDice.map(die => (
                            <Die key={die.id} die={die} toggleKeep={toggleKeep} />
                        ))
                    ) : (
                        <span className="text-muted">보관된 주사위가 없습니다.</span>
                    )}
                </div>
            </div>

            {/* 굴리기 버튼 */}
            <Button 
                variant="primary" 
                size="lg" 
                className="w-100 fw-bold"
                disabled={rollsLeft === 0}
                onClick={rollDice}
            >
                주사위 굴리기
            </Button>
        </Container>
    );
};

export default DiceBoard;