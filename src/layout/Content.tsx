// src/layout/Content.tsx

import { useState, useEffect } from 'react'; // 리액트 훅 불러오기
import { Container } from 'react-bootstrap';

import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'; // 라우팅 관련 훅과 컴포넌트 불러오기 (Routes, Route는 라우터 설정에 사용되고, useNavigate는 프로그래밍 방식으로 라우터 이동을 가능하게 하며, useLocation은 현재 라우터 위치 정보를 가져오는 데 사용됨)

// Header, Footer와 같은 레이아웃 구성 요소 불러오기
import Header from './Header';
import Footer from './Footer';

// components 폴더 내 공통 팝업 및 기능성 컴포넌트 불러오기
import ComboModal from '../components/ComboModal'; 
import TutorialModal from '../components/TutorialModal'; 

// pages 폴더 내 화면 단위 큰 컴포넌트 불러오기
import HomePage from '../pages/HomePage';   
import GamePage from '../pages/GamePage'; 
import DuelPage from '../pages/DuelPage'; 
import HistoryPage from '../pages/HistoryPage'; 
import ReviewPage from '../pages/ReviewPage';

// data 폴더 및 types 폴더에서 관리 리소스 불러오기
import { INITIAL_DICE, INITIAL_CATEGORIES } from '../data/constants'; // 게임 초기 상태를 정의하는 상수들, INITIAL_DICE는 게임 시작 시 주사위 5개의 초기 상태를 나타내는 배열이고, INITIAL_CATEGORIES는 게임에서 사용되는 족보 카테고리들의 초기 상태를 나타내는 배열임
import type { DieType, CategoryType, GameRecord, TurnSnapshot, DuelRecord } from '../types/game'; // 게임에서 사용되는 데이터 타입 정의, DieType은 주사위의 상태를 나타내는 타입, CategoryType은 족보 카테고리의 상태를 나타내는 타입, GameRecord는 게임 기록을 나타내는 타입, TurnSnapshot은 각 턴의 상세 기록을 나타내는 타입, DuelRecord는 다이스 듀얼의 게임 기록을 나타내는 타입임

const Content = () => {
    // 라우터 이동을 위한 useNavigate 훅 사용
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옴, 이 함수는 프로그래밍 방식으로 라우터 이동을 가능하게 함 (예: navigate('/game') 하면 '/game' 경로로 이동)
    const location = useLocation(); // useLocation 훅을 사용하여 현재 라우터 위치 정보를 가져옴, location 객체는 현재 URL 경로 등의 정보를 담고 있음 (예: location.pathname은 현재 URL의 경로를 나타냄)

    // Header의 탭 활성화 UI를 위해 현재 주소 파악 (예: '/' 면 'lobby', '/game' 이면 'game')
    const currentView = location.pathname === '/' ? 'lobby' : location.pathname.substring(1);

    const [selectedRecord, setSelectedRecord] = useState<GameRecord | null>(null); // 기록실에서 선택한 게임 기록을 저장하는 상태 (처음에는 null로 설정)
    const [tutorialShow, setTutorialShow] = useState<boolean>(false); // 튜토리얼 모달이 열려있는지 여부를 관리하는 상태 (처음에는 닫혀있도록 false로 설정)

    // [전적 데이터 상태 및 로컬 스토리지 연동] / 역대 게임 기록 및 로컬 스토리지 연동 상태 관리
    const [currentHistory, setCurrentHistory] = useState<TurnSnapshot[]>([]);
    const [records, setRecords] = useState<GameRecord[]>(() => {
        const saved = localStorage.getItem('yacht_records');
        return saved ? JSON.parse(saved) : [];
    }); // 현재 진행 중인 게임의 턴별 기록을 저장하는 상태 (각 턴마다 선택한 족보, 획득 점수, 주사위 상태 등을 담는 배열로 초기화)

    const [duelRecords, setDuelRecords] = useState<DuelRecord[]>(() => {
        const saved = localStorage.getItem('duel_records');
        return saved ? JSON.parse(saved) : [];
    }); // 다이스 듀얼의 게임 기록을 저장하는 상태, 초기값으로 localStorage에서 불러온 데이터를 사용 (없으면 빈 배열)

    // 기록 데이터 업데이트 시 로컬 스토리지에 자동 저장 (부수 효과 처리)
    useEffect(() => { // records 상태가 변경될 때마다 localStorage에 저장(JSON 형태)하여 페이지를 새로고침해도 기록이 유지되도록 함
        localStorage.setItem('yacht_records', JSON.stringify(records));
    }, [records]);

    useEffect(() => { // duelRecords 상태가 변경될 때마다 localStorage에 저장(JSON 형태)하여 페이지를 새로고침해도 기록이 유지되도록 함
        localStorage.setItem('duel_records', JSON.stringify(duelRecords));
    }, [duelRecords]);

    // [인게임 플레이 상태] / 인게임 플레이 정보 핵심 상태 관리 (data/constants 적용)
    const [dice, setDice] = useState<DieType[]>(INITIAL_DICE); // 현재 주사위 5개의 상태를 저장하는 배열 (각 주사위는 value와 isKept 속성을 가짐, 초기값은 constants.ts에서 불러온 INITIAL_DICE로 설정)
    const [rollsLeft, setRollsLeft] = useState<number>(3); // 한 턴에 주사위를 굴릴 수 있는 횟수를 관리하는 상태, 초기값은 3으로 설정 (최대 3번까지 굴릴 수 있음)
    const [categories, setCategories] = useState<CategoryType[]>(INITIAL_CATEGORIES); // 족보 카테고리와 각 카테고리에 대한 점수 상태를 저장하는 배열 (각 카테고리는 id, name, score 속성을 가짐, 초기값은 constants.ts에서 불러온 INITIAL_CATEGORIES로 설정)
    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '' }); // 특정 족보(요트, 풀하우스, 스트레이트, 초이스 등)를 달성했을 때나 게임이 끝났을 때 보여줄 모달(팝업창)의 상태를 관리하는 객체, show는 모달이 열려있는지 여부, title은 모달의 제목, message는 모달에 표시할 메시지를 담음

    // [게임 로직 함수들] / 주사위 핸들링 및 게임 관리 비즈니스 로직 함수군
    const rollDice = () => {
        if (rollsLeft > 0) { 
            setDice(prevDice => prevDice.map(die => die.isKept ? die : { ...die, value: Math.floor(Math.random() * 6) + 1 })); 
            setRollsLeft(prev => prev - 1); 
        } 
    }; // 주사위를 굴리는 함수, rollsLeft(남은 횟수)가 0보다 클 때만 실행되어야 하며, 5개의 주사위 배열을 돌면서(map) 킵(isKeep)된 주사위는 그대로 두고 킵되지 않은 주사위만 1~6 사이의 랜덤한 숫자로 바꿈, 그리고 rollsLeft를 1 감소시킴

    const toggleKeep = (id: number) => {
        if (rollsLeft === 3) 
            return; // 주사위를 한 번도 안 굴린 턴 시작 상태면 킵 불가
        setDice(prevDice => prevDice.map(die => die.id === id ? { ...die, isKept: !die.isKept } : die)); 
    }; // 주사위를 클릭해 킵(isKeep) 상태를 토글하는 함수, rollsLeft(남은 횟수)가 3일 때는 아직 주사위를 굴리지 않았으므로 킵 상태를 변경할 수 없도록 함, 그리고 주사위 배열을 돌면서(map) 클릭한 주사위(id와 일치하는)를 찾아서 그 주사위의 isKept 값을 반전시킴(토글), 나머지 주사위는 그대로 둠

    const resetGame = () => {
        setCategories(INITIAL_CATEGORIES); // 족보 카테고리의 점수를 모두 null로 초기화하여 새 게임을 시작할 준비를 함
        setCurrentHistory([]); // 현재 게임 기록을 초기화하여 새 게임을 시작할 준비를 함
        setDice(INITIAL_DICE);  // 주사위를 초기값으로 되돌려 새 게임을 시작할 준비를 함
        setRollsLeft(3); // rollsLeft를 3으로 초기화하여 새 게임을 시작할 준비를 함
    }; // 게임을 초기 상태로 리셋하는 함수, 족보 카테고리의 점수를 모두 null로 초기화하고, 현재 게임 기록도 초기화하며, 주사위도 초기값으로 되돌리고, rollsLeft도 3으로 초기화

    const clearRecords = (type: 'yacht' | 'duel') => { // 게임 기록을 삭제하는 함수, type 매개변수로 'yacht' 또는 'duel'을 받음
        if (window.confirm('정말로 선택한 해당 게임 모드의 역대 기록을 전부 영구 삭제하시겠습니까?')) {
            if (type === 'yacht') // 요트 다이스 기록 삭제: records 상태를 빈 배열로 설정하여 모든 요트 다이스 기록을 삭제
                setRecords([]);
            else // 다이스 듀얼 기록 삭제: duelRecords 상태를 빈 배열로 설정하여 모든 다이스 듀얼 기록을 삭제
                setDuelRecords([]);
        }
    };

    const selectCategory = (categoryId: string, score: number) => { // 족보 카테고리를 선택하여 점수를 기록하는 함수, categoryId는 선택한 족보의 고유 식별자, score는 해당 족보에 기록할 점수
        const updatedCategories = categories.map(cat => cat.id === categoryId ? { ...cat, score: score } : cat); // 족보 카테고리 배열을 돌면서(map) 선택한 categoryId와 일치하는 카테고리를 찾아서 그 카테고리의 score를 전달받은 score로 업데이트, 나머지 카테고리는 그대로 둠
        setCategories(updatedCategories); // 업데이트된 족보 카테고리 배열을 상태에 저장하여 점수판이 최신 상태를 반영하도록 함

        // 스냅샷을 생성하여 전적 복기용 턴 배열에 누적
        const snapshot: TurnSnapshot = { 
            turnNumber: currentHistory.length + 1, chosenCategoryId: categoryId, gainedScore: score, diceValues: dice.map(d => ({ value: d.value, isKept: d.isKept })), categoriesState: updatedCategories 
        };// 현재 턴의 기록을 담는 snapshot 객체 생성, turnNumber는 현재 게임 기록 배열의 길이 + 1로 설정하여 현재 턴 번호를 나타냄, chosenCategoryId는 선택한 족보의 id, gainedScore는 선택한 족보에 기록된 점수, diceValues는 현재 주사위 배열을 돌면서(map) 각 주사위의 value와 isKept 상태를 객체 형태로 담은 배열, categoriesState는 점수가 업데이트된 족보 카테고리 배열
        const nextHistory = [...currentHistory, snapshot]; // 기존의 currentHistory 배열에 새로 만든 snapshot 객체를 추가하여 nextHistory 배열을 만듦, 턴별 기록이 누적되어 저장됨
        setCurrentHistory(nextHistory); // 업데이트된 게임 기록을 currentHistory 상태에 저장하여 다음 턴에서도 최신 기록을 참조할 수 있도록 함

        const isGameOver = updatedCategories.every(cat => cat.score !== null); // 게임 종료 여부 판단: 업데이트된 족보 카테고리 배열을 돌면서(every) 모든 카테고리의 score가 null이 아닌지 확인하여(isGameOver) 모든 족보가 채워졌는지 판단, 하나라도 score가 null인 카테고리가 있으면 false, 모두 채워졌으면 true
        
        if (isGameOver) {
            const finalScore = updatedCategories.reduce((sum, cat) => sum + (cat.score || 0), 0); // 최종 점수 계산: 업데이트된 족보 카테고리 배열을 reduce 함수를 사용하여 각 카테고리의 score를 모두 더해서 finalScore 변수에 저장, score가 null인 경우에는 0으로 처리하여 합산
            const newRecord: GameRecord = { 
                id: Date.now().toString(), date: new Date().toLocaleString(), score: finalScore, history: nextHistory 
            }; // 새로운 게임 기록 객체 생성, id는 현재 시간을 문자열로 변환하여 고유한 식별자로 사용, date는 현재 날짜와 시간을 로컬 문자열로 변환하여 저장, score는 최종 점수, history는 턴별 기록이 누적된 nextHistory 배열
            setRecords(prev => [newRecord, ...prev]); // 새 게임 기록을 기존의 records 배열에 추가하여 저장, 최신 기록이 앞에 오도록 배열의 맨 앞에 newRecord를 추가
            setModalInfo({ 
                show: true, title: '🏆 GAME OVER (게임 종료) 🏆', message: `모든 족보를 채웠습니다!\n당신의 최종 점수는 [ ${finalScore} 점 ] 입니다!\n\n확인을 누르면 새 게임이 시작됩니다.` 
            }); // 게임 종료 모달 정보 설정, show를 true로 하여 모달을 열고, title과 message에 게임 종료 메시지와 최종 점수를 포함하여 사용자에게 보여줌
        } else if (score > 0) { // 점수가 0보다 큰 경우에만 특정 족보 달성 모달을 보여줌, score가 0인 경우는 해당 족보를 선택했지만 점수를 획득하지 못한 경우이므로 모달을 띄우지 않음
            if (categoryId === 'yacht') {
                setModalInfo({ 
                    show: true, title: '🎉 YACHT! 🎉', message: '엄청난 행운이네요! 요트를 달성했습니다! (50점)' 
                }); // 요트 달성 모달 정보 설정, show를 true로 하여 모달을 열고, title과 message에 요트를 달성했다는 축하 메시지와 획득 점수를 포함하여 사용자에게 보여줌
            } else if (categoryId === 'fullHouse') {
                setModalInfo({ 
                    show: true, title: '🏠 Full House!', message: '완벽한 조합이네요! 풀하우스를 달성했습니다!' 
                }); // 풀하우스 달성 모달 정보 설정, show를 true로 하여 모달을 열고, title과 message에 풀하우스를 달성했다는 축하 메시지를 포함하여 사용자에게 보여줌
            } else if (categoryId === 'choice') {
                setModalInfo({ 
                    show: true, title: '🎲 Choice!', message: `초이스! 쏠쏠한 ${score}점을 획득했습니다.` 
                }); // 초이스 달성 모달 정보 설정, show를 true로 하여 모달을 열고, title과 message에 초이스를 달성했다는 메시지와 획득 점수를 포함하여 사용자에게 보여줌
            } else if (categoryId === 'straight') {
                setModalInfo({ 
                    show: true, title: '📜 Straight!', message: '연속된 숫자가 완성되었습니다! (30점 획득)' 
                }); // 스트레이트 달성 모달 정보 설정, show를 true로 하여 모달을 열고, title과 message에 스트레이트를 달성했다는 메시지와 획득 점수를 포함하여 사용자에게 보여줌
            }
        }

        // 다음 턴 플레이를 위한 상태 리셋
        setDice(INITIAL_DICE); // 주사위를 초기값으로 되돌려 다음 턴을 시작할 준비를 함
        setRollsLeft(3); // rollsLeft를 3으로 초기화하여 다음 턴을 시작할 준비를 함
    };

    // [라우터 연동 네비게이션 함수들] / 사용자 인터랙션 콜백 및 이벤트 핸들러 함수군
    const handleCloseModal = () => { 
        const isGameOver = categories.every(cat => cat.score !== null); 
        setModalInfo(prev => ({ ...prev, show: false })); 
        if (isGameOver) { 
            resetGame(); 
            navigate('/history'); // 게임 오버 시 전적실 페이지로 URL 이동
        } 
    }; // 모달을 닫는 함수, 모달이 닫힐 때 게임이 종료된 상태인지 확인하여(isGameOver) 모달 정보를 업데이트하여(show를 false로 설정) 모달을 닫고, 만약 게임이 종료된 상태라면 게임을 초기화(resetGame)하고 기록실 화면으로 이동하여 사용자가 자신의 기록을 볼 수 있도록 함

    const handleSelectRecord = (record: GameRecord) => { 
        setSelectedRecord(record); 
        navigate('/review'); // 복기 페이지로 URL 이동
    }; // 기록실에서 특정 게임 기록을 선택했을 때 호출되는 함수, 선택한 record를 selectedRecord 상태에 저장하여 리뷰 페이지에서 해당 기록의 상세 내용을 보여줄 수 있도록 하고, 화면을 리뷰 페이지로 전환하여 사용자가 선택한 기록의 상세 내용을 볼 수 있도록 함

    const handleSaveDuelRecord = (newDuel: DuelRecord) => { 
        setDuelRecords(prev => [newDuel, ...prev]); 
    }; // 다이스 듀얼에서 새로운 게임 기록을 저장하는 함수, 전달받은 newDuel 기록을 기존의 duelRecords 배열에 추가하여 저장, 최신 기록이 앞에 오도록 배열의 맨 앞에 newDuel을 추가

    const handleBackToLobby = () => {
        resetGame(); // 중간 기록 완전 삭제 및 초기화
        navigate('/'); // 메인 로비로 URL 이동
    }; // 게임 플레이 도중에 로비로 나갈 때, 게임 상태를 초기화하고 화면을 로비로 전환하는 함수, resetGame 함수를 호출하여 게임 상태를 초기화하고, navigate('/')를 호출하여 화면을 로비로 전환

    const handleHeaderNavigation = (targetMenu: string) => {
        resetGame(); // 네비게이션 상단 바 메뉴(로비, 전적 등)를 클릭하여 이탈할 때도 리셋을 적용해줍니다.
        navigate(targetMenu === 'lobby' ? '/' : `/${targetMenu}`);
    };

    return (
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            {/* 상단 네비게이션 Header */}
            <Header currentView={currentView} setView={handleHeaderNavigation as any} openTutorial={() => setTutorialShow(true)} />

            {/* 글로벌 반응형 모달 팝업창들 */}
            <ComboModal 
                show={modalInfo.show} 
                title={modalInfo.title} 
                message={modalInfo.message} 
                onHide={handleCloseModal} 
            /> {/* 특정 족보 달성이나 게임 종료 시 보여주는 모달, modalInfo 상태에서 show, title, message를 받아와서 모달을 제어하며, onHide 콜백으로 모달이 닫힐 때 handleCloseModal 함수를 호출하여 게임 종료 시 초기화 및 기록실 이동 등의 후속 처리를 하도록 함 */}

            <TutorialModal 
                show={tutorialShow} 
                onHide={() => setTutorialShow(false)} 
                gameType={currentView === 'duel' ? 'duel' : 'yacht'} 
            /> {/* 룰 설명서 모달, tutorialShow 상태에서 show를 받아와서 모달을 제어하며, onHide 콜백으로 모달이 닫힐 때 setTutorialShow(false)를 호출하여 튜토리얼 모달을 닫도록 함, gameType은 현재 화면이 'duel'이면 'duel'로 설정하고 그렇지 않으면 'yacht'로 설정하여 튜토리얼 내용이 게임 모드에 맞게 표시되도록 함 */}

            {/* 메인 라우터 결과 컨테이너 표출 */}
            <Container className="flex-grow-1 py-4" style={{ maxWidth: '1000px' }}>
                <Routes>
                    <Route path="/" element={<HomePage onSelectGame={(game) => navigate(game === 'yacht' ? '/game' : '/duel')} />} />
                    <Route path="/game" element={<GamePage dice={dice} rollsLeft={rollsLeft} rollDice={rollDice} toggleKeep={toggleKeep} categories={categories} selectCategory={selectCategory} onBack={handleBackToLobby} />} />
                    <Route path="/duel" element={<DuelPage onBack={handleBackToLobby} onSaveRecord={handleSaveDuelRecord} />} />
                    <Route path="/history" element={<HistoryPage records={records} duelRecords={duelRecords} clearRecords={clearRecords} onSelectRecord={handleSelectRecord} />} />
                    {/* Review 페이지는 선택된 기록이 없으면 자동으로 /history 로 튕겨냅니다. */}
                    <Route path="/review" element={selectedRecord ? <ReviewPage record={selectedRecord} onBack={() => navigate('/history')} /> : <Navigate to="/history" replace />} />
                </Routes>
            </Container>

            {/* 하단 Footer */}
            <Footer />
        </div>
    );
};

export default Content;