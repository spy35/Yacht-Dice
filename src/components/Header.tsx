// src/components/Header.tsx
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

type HeaderProps = {
    currentView: string;
    setView: (view: 'game' | 'history') => void; // rules 제거됨
    openTutorial: () => void; // ⭐️ 튜토리얼 모달 핸들러 수신 추가
};

const Header = ({ currentView, setView, openTutorial }: HeaderProps) => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
            <Container style={{ maxWidth: '1000px' }}>
                <Navbar.Brand href="#home" className="fw-bold" onClick={() => setView('game')}>
                    🎲 YACHT DICE
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto fw-bold align-items-center">
                        <Nav.Link onClick={() => setView('game')} active={currentView === 'game'}>
                            🏠 홈 (게임하기)
                        </Nav.Link>
                        <Nav.Link onClick={() => setView('history')} active={currentView === 'history'}>
                            🏆 이전 결과
                        </Nav.Link>
                        {/* ⭐️ 링크 형태 대신 눈에 띄는 부트스트랩 가이드 버튼으로 배치 */}
                        <Button variant="outline-warning" size="sm" className="ms-2 fw-bold text-white" onClick={openTutorial}>
                            📖 튜토리얼 보기
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;