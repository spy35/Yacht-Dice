// src/components/Die.tsx
import { Button } from 'react-bootstrap';
import type { DieType } from '../types/game'; // DieType은 주사위 객체의 타입 정의, id, value, isKept 등의 속성을 가짐

type DieProps = {
    die: Partial<DieType> & { value: number }; // die 객체, Partial을 써서 모든 정보가 없어도 되지만, value(주사위 눈금)만큼은 무조건 있어야 한다고 강제
    toggleKeep?: (id: number) => void; // 주사위를 보관하거나 보관 해제하는 함수, 선택적(optional)로 정의하여 튜토리얼 등에서 클릭 불가능한 주사위를 만들 수 있도록 함
    size?: string; // 주사위의 크기를 조절하는 선택적 prop, 기본값은 '80px'로 설정하여 일반 게임 화면에서는 큰 주사위를 보여주고, 튜토리얼 등에서는 작은 주사위를 보여줄 수 있도록 함
};

const Die = ({ die, toggleKeep, size = '80px' }: DieProps) => {
    // toggleKeep 함수와 고유 id가 존재할 때만 클릭 가능한 주사위로 인식
    const isClickable = !!toggleKeep && die.id !== undefined; // toggleKeep이 존재하고 die.id가 정의되어 있을 때만 isClickable이 true가 됨, 그렇지 않으면 false가 되어 클릭 불가능한 주사위로 처리

    return (
        <Button 
            variant={die.isKept ? "warning" : "outline-dark"} // die.isKept이 true(보관 O)면 노란색 버튼, false(보관 X)면 테두리만 있는 어두운 색 버튼
            className="m-1 p-0 d-flex align-items-center justify-content-center fw-bold"
            style={{ 
                width: size, 
                height: size, 
                // 전달받은 size에 비례해서 주사위 안의 숫자 크기도 자동 조절
                fontSize: size === '80px' ? '2rem' : size === '70px' ? '1.8rem' : size === '45px' ? '1.2rem' : '0.9rem',
                cursor: isClickable ? 'pointer' : 'default', // 클릭 가능한 주사위는 포인터 커서로, 클릭 불가능한 주사위는 기본 커서로 표시하여 시각적으로 구분
                borderRadius: '8px'
            }}
            disabled={!isClickable} // 클릭 불가능한 상태(튜토리얼 등)일 때는 버튼 비활성화
            onClick={() => isClickable ? toggleKeep(die.id!) : null} // 클릭 가능한 주사위일 때만 toggleKeep 함수 호출, die.id는 undefined가 아니라고 타입스크립트에게 확신시키기 위해 느낌표(!) 사용
        >
            {die.value}
        </Button>
    );
};

export default Die;