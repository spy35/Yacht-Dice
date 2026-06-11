// src/App.tsx
import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header';
import Footer from './components/Footer';
import DiceBoard from './components/DiceBoard';
import ScoreBoard from './components/ScoreBoard'; 
import ComboModal from './components/ComboModal'; 
import HistoryPage from './components/HistoryPage'; 
import ReviewPage from './components/ReviewPage'; // ⭐️ 추가
import TutorialModal from './components/TutorialModal'; 
import type { DieType, CategoryType, GameRecord, TurnSnapshot } from './types/game';

function App() {
    // ⭐️ 'review' 뷰 상태 타입 추가
    const [currentView, setView] = useState<'game' | 'history' | 'review'>('game');
    const [selectedRecord, setSelectedRecord] = useState<GameRecord | null>(null); // 복기할 타겟 결과 객체
    const [tutorialShow, setTutorialShow] = useState<boolean>(false);

    // ⭐️ 인게임 도중 매 턴마다 기록을 모아둘 상태 임시 배열
    const [currentHistory, setCurrentHistory] = useState<TurnSnapshot[]>([]);

    const [records, setRecords] = useState<GameRecord[]>(() => {
        const saved = localStorage.getItem('yacht_records');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('yacht_records', JSON.stringify(records));
    }, [records]);

    const [dice, setDice] = useState<DieType[]>([
        { id: 1, value: 1, isKept: false },
        { id: 2, value: 2, isKept: false },
        { id: 3, value: 3, isKept: false },
        { id: 4, value: 4, isKept: false },
        { id: 5, value: 5, isKept: false },
    ]);
    const [rollsLeft, setRollsLeft] = useState<number>(3);
    const [categories, setCategories] = useState<CategoryType[]>([
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
    ]);

    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' });

    const rollDice = () => { 
        if (rollsLeft > 0) {
            setDice(prevDice => prevDice.map(die =>
                die.isKept ? die : { ...die, value: Math.floor(Math.random() * 6) + 1 }
            ));
            setRollsLeft(prev => prev - 1);
        }
    };
    
    const toggleKeep = (id: number) => { 
        if (rollsLeft === 3) return;
        setDice(prevDice => prevDice.map(die =>
            die.id === id ? { ...die, isKept: !die.isKept } : die
        ));
    };

    const resetGame = () => {
        setCategories(prev => prev.map(cat => ({ ...cat, score: null })));
        setCurrentHistory([]); // 히스토리 초기화
        setDice([
            { id: 1, value: 1, isKept: false },
            { id: 2, value: 2, isKept: false },
            { id: 3, value: 3, isKept: false },
            { id: 4, value: 4, isKept: false },
            { id: 5, value: 5, isKept: false },
        ]);
        setRollsLeft(3);
    };

    const clearRecords = () => {
        if (window.confirm('정말로 모든 게임 기록을 삭제하시겠습니까?')) {
            setRecords([]);
        }
    };

    const selectCategory = (categoryId: string, score: number) => {
        const updatedCategories = categories.map(cat => 
            cat.id === categoryId ? { ...cat, score: score } : cat
        );
        setCategories(updatedCategories);

        // ⭐️ 1단계 보완 적용: 매 칸을 채울 때마다 당시 주as위 배치와 보드 정보를 가공하여 스냅샷으로 모아둠
        const snapshot: TurnSnapshot = {
            turnNumber: currentHistory.length + 1,
            chosenCategoryId: categoryId,
            gainedScore: score,
            diceValues: dice.map(d => ({ value: d.value, isKept: d.isKept })),
            categoriesState: updatedCategories // 반영된 누적 점수판 데이터 통째로 주입
        };
        const nextHistory = [...currentHistory, snapshot];
        setCurrentHistory(nextHistory);

        const isGameOver = updatedCategories.every(cat => cat.score !== null);

        if (isGameOver) {
            const finalScore = updatedCategories.reduce((sum, cat) => sum + (cat.score || 0), 0);

            const newRecord: GameRecord = {
                id: Date.now().toString(),
                date: new Date().toLocaleString(),
                score: finalScore,
                history: nextHistory // ⭐️ 턴별 기록 배열 주입
            };
            setRecords(prev => [newRecord, ...prev]);

            setModalInfo({
                show: true,
                title: '🏆 GAME OVER (게임 종료) 🏆',
                message: `모든 족보를 채웠습니다!\n당신의 최종 점수는 [ ${finalScore} 점 ] 입니다!\n\n확인을 누르면 새 게임이 시작됩니다.`
            });
        } else if (score > 0) { 
            if (categoryId === 'yacht') {
                setModalInfo({ show: true, title: '🎉 YACHT! 🎉', message: '엄청난 행운이네요! 요트를 달성했습니다! (50점)' });
            } else if (categoryId === 'fullHouse') {
                setModalInfo({ show: true, title: '🏠 Full House!', message: '완벽한 조합이네요! 풀하우스를 달성했습니다!' });
            } else if (categoryId === 'choice') {
                setModalInfo({ show: true, title: '🎲 Choice!', message: `초이스! 쏠쏠한 ${score}점을 획득했습니다.` });
            } else if (categoryId === 'straight') {
                setModalInfo({ show: true, title: '📜 Straight!', message: '연속된 숫자가 완성되었습니다! (30점 획득)' });
            }
        }

        setDice([
            { id: 1, value: 1, isKept: false },
            { id: 2, value: 2, isKept: false },
            { id: 3, value: 3, isKept: false },
            { id: 4, value: 4, isKept: false },
            { id: 5, value: 5, isKept: false },
        ]);
        setRollsLeft(3); 
    };

    const handleCloseModal = () => {
        const isGameOver = categories.every(cat => cat.score !== null);
        setModalInfo(prev => ({ ...prev, show: false }));
        if (isGameOver) {
            resetGame();
            setView('history');
        }
    };

    // ⭐️ 기록 리스트에서 행을 클릭하면 실행될 핸들러 함수
    const handleSelectRecord = (record: GameRecord) => {
        setSelectedRecord(record);
        setView('review'); // 복기 페이지 뷰로 라우터 변경
    };

    const renderMainContent = () => {
        switch (currentView) {
            case 'history':
                return <HistoryPage records={records} clearRecords={clearRecords} onSelectRecord={handleSelectRecord} />;
            case 'review':
                // ⭐️ 복기 화면 렌더링 호출
                return selectedRecord ? (
                    <ReviewPage record={selectedRecord} onBack={() => setView('history')} />
                ) : null;
            case 'game':
            default:
                return (
                    <Row className="g-4">
                        <Col lg={6}>
                            <DiceBoard dice={dice} rollsLeft={rollsLeft} rollDice={rollDice} toggleKeep={toggleKeep} />
                        </Col>
                        <Col lg={6}>
                            <ScoreBoard categories={categories} dice={dice} rollsLeft={rollsLeft} selectCategory={selectCategory} />
                        </Col>
                    </Row>
                );
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            <Header currentView={currentView === 'review' ? 'history' : currentView} setView={(v) => setView(v as any)} openTutorial={() => setTutorialShow(true)} />

            <ComboModal show={modalInfo.show} title={modalInfo.title} message={modalInfo.message} onHide={handleCloseModal} />
            <TutorialModal show={tutorialShow} onHide={() => setTutorialShow(false)} />

            <Container className="flex-grow-1 py-4" style={{ maxWidth: '1000px' }}>
                {renderMainContent()}
            </Container>

            <Footer />
        </div>
    );
}

export default App;