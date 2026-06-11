// src/components/Die.tsx
import { Button } from 'react-bootstrap';
import type { DieType } from '../types/game';

// ⭐️ 바로 이 부분에 size?: string; 이 반드시 들어가야 합니다!
type DieProps = {
    die: Partial<DieType> & { value: number }; 
    toggleKeep?: (id: number) => void; // 클릭 함수도 필수가 아닌 옵션(?)으로 설정
    size?: string;                     // 크기 조절 속성 추가
};

const Die = ({ die, toggleKeep, size = '80px' }: DieProps) => {
    // toggleKeep 함수와 고유 id가 존재할 때만 클릭 가능한 주사위로 인식
    const isClickable = !!toggleKeep && die.id !== undefined;

    return (
        <Button 
            variant={die.isKept ? "warning" : "outline-dark"} 
            className="m-1 p-0 d-flex align-items-center justify-content-center fw-bold"
            style={{ 
                width: size, 
                height: size, 
                // 전달받은 size에 비례해서 주사위 안의 숫자 크기도 자동 조절
                fontSize: size === '80px' ? '2rem' : size === '70px' ? '1.8rem' : size === '45px' ? '1.2rem' : '0.9rem',
                cursor: isClickable ? 'pointer' : 'default',
                borderRadius: '8px'
            }}
            disabled={!isClickable} // 클릭 불가능한 상태(튜토리얼 등)일 때는 버튼 비활성화
            onClick={() => isClickable ? toggleKeep(die.id!) : null}
        >
            {die.value}
        </Button>
    );
};

export default Die;