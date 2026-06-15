// src/components/Header.tsx
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

type HeaderProps = {
    currentView: string; // 현재 화면을 나타내는 문자열, 'lobby', 'game', 'history' 등의 값을 가질 수 있으며, 이 값에 따라 헤더에서 활성화된 메뉴 항목이나 룰 설명서 버튼의 표시 여부가 결정됨
    setView: (view: 'lobby' | 'game' | 'history') => void; // 화면 전환을 담당하는 함수, 사용자가 헤더의 메뉴 항목을 클릭할 때 호출되어 해당 메뉴에 맞는 화면으로 전환하는 로직이 실행됨 (예: 'lobby'로 설정하면 메인 로비 화면으로, 'game'으로 설정하면 게임 플레이 화면으로 이동하는 등의 방식으로 구현될 수 있음)
    openTutorial: () => void; // 룰 설명서 모달을 여는 함수, 사용자가 헤더의 "룰 설명서" 버튼을 클릭할 때 호출되어 게임의 규칙과 플레이 방법을 설명하는 모달이 열리는 등의 UI 로직이 실행됨
};

const Header = ({ currentView, setView, openTutorial }: HeaderProps) => {
    const isLobby = currentView === 'lobby'; // 현재 화면이 메인 로비인지 여부를 나타내는 boolean 값, currentView가 'lobby'일 때 true, 그렇지 않으면 false로 설정되어 헤더에서 메뉴 항목과 룰 설명서 버튼의 표시 여부를 제어하는 로직이 실행됨
    
    const canShowRules = currentView === 'game' || currentView === 'duel'; // 룰 설명서 버튼을 보여줄 수 있는지 여부를 나타내는 boolean 값, currentView가 'game' 또는 'duel'일 때 true로 설정되어 게임 플레이 화면이나 듀얼 화면에서만 룰 설명서 버튼이 표시되고, 메인 로비나 기록실 화면에서는 표시되지 않도록 제어하는 로직이 실행됨

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
            <Container style={{ maxWidth: '1000px' }}>
                <Navbar.Brand href="#home" className="fw-bold" onClick={() => setView('lobby')}>
                    🎲 GAME HUB
                </Navbar.Brand>
                
                {!isLobby && (
                    <>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto fw-bold align-items-center">
                                <Nav.Link onClick={() => setView('lobby')} active={currentView === 'lobby'}>
                                    🏠 게임 로비
                                </Nav.Link>
                                <Nav.Link onClick={() => setView('history')} active={currentView === 'history' || currentView === 'review'}>
                                    🏆 이전 결과
                                </Nav.Link>
                                
                                {canShowRules && (
                                    <Button variant="outline-warning" size="sm" className="ms-2 fw-bold text-white" onClick={openTutorial}>
                                        📖 룰 설명서
                                    </Button>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </>
                )}
            </Container>
        </Navbar>
    );
};

export default Header;