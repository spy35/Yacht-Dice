// src/components/ComboModal.tsx
import { Modal, Button } from 'react-bootstrap'; 

type ComboModalProps = { // 족보 달성이나 게임 종료 시 보여주는 모달의 props(데이터) 타입 정의
    show: boolean; // 모달이 보이는지 여부를 나타내는 boolean 값, true면 모달이 보이고 false면 모달이 숨겨짐
    title: string; // 모달의 제목
    message: string; // 모달의 내용
    onHide: () => void; // 모달을 닫는 콜백 함수
};

const ComboModal = ({ show, title, message, onHide }: ComboModalProps) => { // ComboModal 컴포넌트 정의, props로 show, title, message, onHide를 받아와서 모달의 상태와 내용을 제어
    return (
        <Modal show={show} onHide={onHide} centered> {/* Modal(부트스트랩) 컴포넌트 사용, show: 부모가 준 show 값이 true이면 모달이 보임, onHide: 모달을 닫는 함수, 모달을 화면 중앙에 위치시키는 centered 속성 추가 */}
            <Modal.Header closeButton className="bg-warning"> {/* closeButton: 모달 우측 상단에 닫기 버튼 추가, className="bg-warning": 배경색을 노란색으로 설정 */}
                <Modal.Title className="fw-bold text-dark">{title}</Modal.Title> {/* 부모가 전달해준 title, className="fw-bold text-dark": 글자 두껍게, 어두운 색으로 설정 */}
            </Modal.Header>
            <Modal.Body className="text-center py-5 fs-4"> {/* 모달 본문, className="text-center py-5 fs-4": 텍스트 중앙 정렬, 상하 여백 크게, 글자 크기 크게 설정 */}
                {message} {/* 부모가 전달해준 message 출력 */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={onHide}>계속하기</Button> {/* 모달 하단의 버튼, variant="dark": 어두운 색 버튼, onClick: 버튼 클릭 시 모달을 닫는 함수(onHide) 호출 */}
            </Modal.Footer>
        </Modal>
    );
};

export default ComboModal;