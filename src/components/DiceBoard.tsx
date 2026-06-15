// src/components/DiceBoard.tsx
import { Container, Button } from 'react-bootstrap';
import Die from './Die'; // 개별 주사위를 그리는 컴포넌트, 컴포넌트가 중첩되는 구조
import type { DieType } from '../types/game'; // DieType은 주사위 객체의 타입 정의, id, value, isKept 등의 속성을 가짐

type DiceBoardProps = { 
    dice: DieType[]; // 게임에서 현재 굴려진 주사위들의 상태를 나타내는 배열, 각 주사위는 DieType으로 정의된 객체 형태로 되어 있음
    rollsLeft: number; // 플레이어가 현재 라운드에서 남은 굴리기 횟수, 3회에서 시작하여 주사위를 굴릴 때마다 감소함
    rollDice?: () => void; // 주사위를 굴리는 함수, 플레이어가 "주사위 굴리기" 버튼을 클릭할 때 호출되어 주사위들의 값이 랜덤하게 변경되고 rollsLeft가 감소하는 등의 게임 로직이 실행됨 (읽기 모드일 때는 함수가 없을 수 있으므로 ? 선택 처리)
    toggleKeep?: (id: number) => void; // 주사위를 보관하거나 보관 해제하는 함수, 플레이어가 특정 주사위를 클릭할 때 호출되어 해당 주사위의 isKept 상태를 토글하는 등의 게임 로직이 실행됨 (여기도 ? 선택 처리)
    isReadOnly?: boolean; // 읽기 전용 모드 여부, true일 때는 주사위를 굴리거나 보관 상태를 변경하는 기능이 모두 비활성화되고 단순히 주사위의 현재 상태를 보여주는 용도로 사용됨 (예: 가상 플레이, 기록 복기 등)
}; // 부모로부터 전달받아야 할 데이터와 함수(props)의 타입 정의

const DiceBoard = ({ dice, rollsLeft, rollDice, toggleKeep, isReadOnly = false }: DiceBoardProps) => { // DiceBoard 컴포넌트 정의, props로 상태와 함수들을 받아와서 주사위 보드의 상태와 동작을 제어
    
    // 전체 주사위 배열을 필드와 보관함 두 그룹으로 나눕니다.
    const rollingDice = dice.filter(die => !die.isKept); // 굴리는 주사위, isKept이 false인 주사위들만 필터링하여 rollingDice 배열에 저장
    const keptDice = dice.filter(die => die.isKept); // 보관된 주사위, isKept이 true인 주사위들만 필터링하여 keptDice 배열에 저장

    return (
        // DiceBoard 컴포넌트의 전체 레이아웃, Container로 감싸서 중앙 정렬과 패딩을 주고, 내부에 필드(굴리는 주사위 영역), 보관함(킵한 주사위 영역), 굴리기 버튼으로 구성된 구조
        <Container className="border p-4 rounded text-center bg-light shadow-sm h-100 d-flex flex-column justify-content-center">
            {/* 읽기 모드 여부에 따라 제목과 안내 문구 변경 */}
            <h3 className="mb-1">{isReadOnly ? "🎲 주사위 배치 상태" : "🎲 주사위 굴리기"}</h3>
            {isReadOnly ? (
                <p className="text-muted mb-4">가상/기록 복기 모드입니다.</p>
            ) : (
                <p className="text-muted fw-bold mb-4">남은 횟수: {rollsLeft}번</p>
            )}
            
            {/* 1. 필드 (굴리는 주사위 영역) */}
            <div className="mb-4 p-3 bg-white rounded border" style={{ minHeight: '140px' }}>
                <h6 className="text-secondary mb-2">필드 (Field)</h6>
                <div className="d-flex justify-content-center align-items-center flex-wrap" style={{ minHeight: '80px' }}>
                    {rollingDice.length > 0 ? (
                        rollingDice.map(die => (
                            <Die 
                                key={die.id} 
                                die={die} 
                                // 읽기 모드면 toggleKeep을 undefined로 주어 클릭을 원천 차단!
                                toggleKeep={isReadOnly ? undefined : toggleKeep} 
                                size={isReadOnly ? "65px" : "80px"} // 읽기 모드면 살짝 작게 표시
                            />
                        ))
                    ) : (
                        <span className="text-muted">모든 주사위를 보관했습니다.</span>
                    )}
                </div>
            </div>

            {/* 2. 보관함 (킵한 주사위 영역) */}
            <div className="mb-4 p-3 rounded border" style={{ minHeight: '140px', backgroundColor: '#fff3cd' }}>
                <h6 className="text-warning mb-2" style={{ fontWeight: 'bold' }}>보관함 (Keep)</h6>
                <div className="d-flex justify-content-center align-items-center flex-wrap" style={{ minHeight: '80px' }}>
                    {keptDice.length > 0 ? (
                        keptDice.map(die => (
                            <Die 
                                key={die.id} 
                                die={die} 
                                toggleKeep={isReadOnly ? undefined : toggleKeep} 
                                size={isReadOnly ? "65px" : "80px"} 
                            />
                        ))
                    ) : (
                        <span className="text-muted">보관된 주사위가 없습니다.</span>
                    )}
                </div>
            </div>

            {/* 굴리기 버튼 (읽기 모드가 아닐 때만 렌더링) */}
            {!isReadOnly && rollDice && (
                <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-100 fw-bold mt-auto"
                    disabled={rollsLeft === 0}
                    onClick={rollDice}
                >
                    주사위 굴리기
                </Button>
            )}
        </Container>
    );
};

export default DiceBoard;