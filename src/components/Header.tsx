// src/components/Header.tsx
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

type HeaderProps = {
    currentView: string;
    setView: (view: 'lobby' | 'game' | 'history') => void;
    openTutorial: () => void;
};

const Header = ({ currentView, setView, openTutorial }: HeaderProps) => {
    // ⭐️ 이상한 한자(注册)를 정상적인 변수명(isLobby)으로 수정했습니다!
    const isLobby = currentView === 'lobby';
    
    // ⭐️ 룰 설명서 노출 가능 페이지 조건 검사 분기 (요트 또는 듀얼 게임방 내부에서만 뜸)
    const canShowRules = currentView === 'game' || currentView === 'duel';

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
            <Container style={{ maxWidth: '1000px' }}>
                <Navbar.Brand href="#home" className="fw-bold" onClick={() => setView('lobby')}>
                    🎲 GAME HUB
                </Navbar.Brand>
                
                {/* ⭐️ 수정한 isLobby 변수를 여기에 적용합니다. */}
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
                                
                                {/* ⭐️ 조건부 노출: 요트방이나 듀얼방 내부에서만 연동 가이드 버튼 출력 */}
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