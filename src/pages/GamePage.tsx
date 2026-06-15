// src/pages/GamePage.tsx
import { Row, Col, Button, Container } from 'react-bootstrap';
import DiceBoard from '../components/DiceBoard';
import ScoreBoard from '../components/ScoreBoard';
import type { DieType, CategoryType } from '../types/game';

type GamePageProps = {
    dice: DieType[]; // 게임에서 현재 굴려진 주사위들의 상태를 나타내는 배열, 각 주사위는 DieType으로 정의된 객체 형태로 되어 있음
    rollsLeft: number; // 플레이어가 현재 라운드에서 남은 굴리기 횟수, 3회에서 시작하여 주사위를 굴릴 때마다 감소함
    rollDice: () => void; // 주사위를 굴리는 함수, 플레이어가 "주사위 굴리기" 버튼을 클릭할 때 호출되어 주사위들의 값이 랜덤하게 변경되고 rollsLeft가 감소하는 등의 게임 로직이 실행됨
    toggleKeep: (id: number) => void; // 주사위를 보관하거나 보관 해제하는 함수, 플레이어가 특정 주사위를 클릭할 때 호출되어 해당 주사위의 isKept 상태를 토글하는 등의 게임 로직이 실행됨
    categories: CategoryType[]; // 게임에서 선택 가능한 족보 카테고리들의 배열, 각 카테고리는 CategoryType으로 정의된 객체 형태로 되어 있으며 id, name, description 등의 속성을 가짐
    selectCategory: (categoryId: string, score: number) => void; // 족보 카테고리를 선택하는 함수, 플레이어가 특정 족보 카테고리를 선택할 때 호출되어 해당 카테고리의 id와 그 카테고리를 선택했을 때 획득할 점수를 인자로 받아 게임 로직이 실행됨
    onBack: () => void; // 게임 페이지에서 메인 로비로 돌아가는 함수, 플레이어가 "메인 로비로 가기" 버튼을 클릭할 때 호출되어 게임 페이지에서 메인 로비로 이동하는 등의 UI 로직이 실행됨
};

const GamePage = ({ dice, rollsLeft, rollDice, toggleKeep, categories, selectCategory, onBack }: GamePageProps) => {
    return (
        <Container className="py-2" style={{ maxWidth: '1000px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="outline-dark" onClick={onBack} className="fw-bold">
                    ← 메인 로비로 가기
                </Button>
                <h3 className="fw-bold text-dark m-0">🎲 YACHT DICE MODE</h3>
            </div>

            <Row className="g-4">
                <Col lg={6}>
                    <DiceBoard dice={dice} rollsLeft={rollsLeft} rollDice={rollDice} toggleKeep={toggleKeep} />
                </Col>
                <Col lg={6}>
                    <ScoreBoard categories={categories} dice={dice} rollsLeft={rollsLeft} selectCategory={selectCategory} />
                </Col>
            </Row>
        </Container>
    );
};

export default GamePage;