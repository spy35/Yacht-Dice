// src/components/ComboModal.tsx
import { Modal, Button } from 'react-bootstrap';

type ComboModalProps = {
    show: boolean;
    title: string;
    message: string;
    onHide: () => void;
};

const ComboModal = ({ show, title, message, onHide }: ComboModalProps) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="bg-warning">
                <Modal.Title className="fw-bold text-dark">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center py-5 fs-4">
                {message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={onHide}>계속하기</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ComboModal;