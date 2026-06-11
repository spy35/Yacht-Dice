// src/components/Footer.tsx
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-4 mt-auto">
            <Container>
                <h5 className="fw-bold mb-2">요트 다이스 싱글 플레이어 프로젝트</h5>
                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                    웹시스템설계및개발 기말 프로젝트
                </p>
            </Container>
        </footer>
    );
};

export default Footer;