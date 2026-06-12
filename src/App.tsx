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
import ReviewPage from './components/ReviewPage'; 
import TutorialModal from './components/TutorialModal'; 
import HomePage from './components/HomePage';   
import DiceDuel from './components/DiceDuel';   
// ⭐️ DuelRecord 타입 추가 수입
import type { DieType, CategoryType, GameRecord, TurnSnapshot, DuelRecord } from './types/game';

function App() {
    const [currentView, setView] = useState<'lobby' | 'game' | 'duel' | 'history' | 'review'>('lobby');
    const [selectedRecord, setSelectedRecord] = useState<GameRecord | null>(null);
    const [tutorialShow, setTutorialShow] = useState<boolean>(false);
    const [currentHistory, setCurrentHistory] = useState<TurnSnapshot[]>([]);

    const [records, setRecords] = useState<GameRecord[]>(() => {
        const saved = localStorage.getItem('yacht_records');
        return saved ? JSON.parse(saved) : [];
    });

    // ⭐️ 추가: 다이스 듀얼 매치 결과 배열 상태 (로컬 스토리지 연동형)
    const [duelRecords, setDuelRecords] = useState<DuelRecord[]>(() => {
        const saved = localStorage.getItem('duel_records');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('yacht_records', JSON.stringify(records));
    }, [records]);

    // ⭐️ 추가: 다이스 듀얼 기록 자동 영속성 저장 훅
    useEffect(() => {
        localStorage.setItem('duel_records', JSON.stringify(duelRecords));
    }, [duelRecords]);

    // ... (중간 요트 다이스 전용 인게임 스태틱 스펙 완전 동일) ...
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

    const rollDice = () => { if (rollsLeft > 0) { setDice(prevDice => prevDice.map(die => die.isKept ? die : { ...die, value: Math.floor(Math.random() * 6) + 1 })); setRollsLeft(prev => prev - 1); } };
    const toggleKeep = (id: number) => { if (rollsLeft === 3) return; setDice(prevDice => prevDice.map(die => die.id === id ? { ...die, isKept: !die.isKept } : die)); };
    const resetGame = () => { setCategories(prev => prev.map(cat => ({ ...cat, score: null }))); setCurrentHistory([]); setDice([{ id: 1, value: 1, isKept: false }, { id: 2, value: 2, isKept: false }, { id: 3, value: 3, isKept: false }, { id: 4, value: 4, isKept: false }, { id: 5, value: 5, isKept: false }]); setRollsLeft(3); };

    // ⭐️ 수정: 어떤 탭 유형의 기록을 삭제하느냐에 따라 분기 초기화하도록 람다식 개편
    const clearRecords = (type: 'yacht' | 'duel') => {
        if (window.confirm('정말로 선택한 해당 게임 모드의 역대 기록을 전부 영구 삭제하시겠습니까?')) {
            if (type === 'yacht') setRecords([]);
            else setDuelRecords([]);
        }
    };

    const selectCategory = (categoryId: string, score: number) => {
        const updatedCategories = categories.map(cat => cat.id === categoryId ? { ...cat, score: score } : cat);
        setCategories(updatedCategories);
        const snapshot: TurnSnapshot = { turnNumber: currentHistory.length + 1, chosenCategoryId: categoryId, gainedScore: score, diceValues: dice.map(d => ({ value: d.value, isKept: d.isKept })), categoriesState: updatedCategories };
        const nextHistory = [...currentHistory, snapshot];
        setCurrentHistory(nextHistory);
        const isGameOver = updatedCategories.every(cat => cat.score !== null);
        if (isGameOver) {
            const finalScore = updatedCategories.reduce((sum, cat) => sum + (cat.score || 0), 0);
            const newRecord: GameRecord = { id: Date.now().toString(), date: new Date().toLocaleString(), score: finalScore, history: nextHistory };
            setRecords(prev => [newRecord, ...prev]);
            setModalInfo({ show: true, title: '🏆 GAME OVER (게임 종료) 🏆', message: `모든 족보를 채웠습니다!\n당신의 최종 점수는 [ ${finalScore} 점 ] 입니다!\n\n확인을 누르면 새 게임이 시작됩니다.` });
        } else if (score > 0) { 
            if (categoryId === 'yacht') setModalInfo({ show: true, title: '🎉 YACHT! 🎉', message: '엄청난 행운이네요! 요트를 달성했습니다! (50점)' });
            else if (categoryId === 'fullHouse') setModalInfo({ show: true, title: '🏠 Full House!', message: '완벽한 조합이네요! 풀하우스를 달성했습니다!' });
            else if (categoryId === 'choice') setModalInfo({ show: true, title: '🎲 Choice!', message: `초이스! 쏠쏠한 ${score}점을 획득했습니다.` });
            else if (categoryId === 'straight') setModalInfo({ show: true, title: '📜 Straight!', message: '연속된 숫자가 완성되었습니다! (30점 획득)' });
        }
        setDice([{ id: 1, value: 1, isKept: false }, { id: 2, value: 2, isKept: false }, { id: 3, value: 3, isKept: false }, { id: 4, value: 4, isKept: false }, { id: 5, value: 5, isKept: false }]); setRollsLeft(3); 
    };

    const handleCloseModal = () => { const isGameOver = categories.every(cat => cat.score !== null); setModalInfo(prev => ({ ...prev, show: false })); if (isGameOver) { resetGame(); setView('history'); } };
    const handleSelectRecord = (record: GameRecord) => { setSelectedRecord(record); setView('review'); };

    // ⭐️ 추가: 다이스 듀얼 매치 발생 시 호출될 콜백 누적기
    const handleSaveDuelRecord = (newDuel: DuelRecord) => {
        setDuelRecords(prev => [newDuel, ...prev]);
    };

    const renderMainContent = () => {
        switch (currentView) {
            case 'lobby':
                return <HomePage onSelectGame={(game) => setView(game === 'yacht' ? 'game' : 'duel')} />;
            case 'duel':
                // ⭐️ 다이스 듀얼 페이지에 기록 가동 콜백 바인딩
                return <DiceDuel onBack={() => setView('lobby')} onSaveRecord={handleSaveDuelRecord} />;
            case 'history':
                // ⭐️ 기록실에 요트배열, 듀얼배열, 분기삭제 함수 동시 딜리버리 전달
                return (
                    <HistoryPage 
                        records={records} 
                        duelRecords={duelRecords} 
                        clearRecords={clearRecords} 
                        onSelectRecord={handleSelectRecord} 
                    />
                );
            case 'review':
                return selectedRecord ? <ReviewPage record={selectedRecord} onBack={() => setView('history')} /> : null;
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
            <Header currentView={currentView} setView={(v) => setView(v as any)} openTutorial={() => setTutorialShow(true)} />

            <ComboModal show={modalInfo.show} title={modalInfo.title} message={modalInfo.message} onHide={handleCloseModal} />
            
            {/* ⭐️ 확장된 다형성 TutorialModal 조립: 현재 뷰가 duel이면 duel용 룰, 아니면 yacht용 룰 전달 */}
            <TutorialModal 
                show={tutorialShow} 
                onHide={() => setTutorialShow(false)} 
                gameType={currentView === 'duel' ? 'duel' : 'yacht'} 
            />

            <Container className="flex-grow-1 py-4" style={{ maxWidth: '1000px' }}>
                {renderMainContent()}
            </Container>

            <Footer />
        </div>
    );
}

export default App;