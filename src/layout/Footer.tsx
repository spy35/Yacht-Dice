// src/components/Footer.tsx
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-4 mt-auto">
            <Container>
                <h5 className="fw-bold mb-2">AI 웹개발 프로젝트</h5>
                <p className="mb-0">이동연, 권순범, 최정호</p>
            </Container>
        </footer>
    );
};

export default Footer;