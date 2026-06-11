// src/components/HistoryPage.tsx
import { Container, Table, Button } from 'react-bootstrap';
import type { GameRecord } from '../types/game';

type HistoryPageProps = {
    records: GameRecord[];
    clearRecords: () => void;
    onSelectRecord: (record: GameRecord) => void; // ⭐️ 추가: 클릭 핸들러 Props 수신
};

const HistoryPage = ({ records, clearRecords, onSelectRecord }: HistoryPageProps) => {
    return (
        <Container className="py-4" style={{ maxWidth: '800px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark m-0">🏆 이전 플레이 결과</h2>
                {records.length > 0 && (
                    <Button variant="outline-danger" onClick={clearRecords} className="fw-bold">
                        기록 전체 삭제
                    </Button>
                )}
            </div>

            <div className="bg-white p-4 rounded border shadow-sm">
                {records.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <p className="fs-4 mb-2">🎲 아직 플레이한 기록이 없습니다.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-start text-muted mb-2">💡 항목을 클릭하면 당시 1턴부터 10턴까지의 플레이를 <b>한 턴씩 슬라이드로 복기</b>할 수 있습니다.</p>
                        <Table striped bordered hover responsive className="text-center align-middle mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ width: '20%' }}>순위</th>
                                    <th style={{ width: '50%' }}>플레이 일시</th>
                                    <th style={{ width: '30%' }}>최종 점수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...records]
                                    .sort((a, b) => b.score - a.score)
                                    .map((record, index) => (
                                        <tr 
                                            key={record.id}
                                            onClick={() => onSelectRecord(record)} // ⭐️ 클릭 시 복기 모드 전동
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="fw-bold text-secondary">
                                                {index === 0 ? '🥇 1등' : index === 1 ? '🥈 2등' : index === 2 ? '🥉 3등' : `${index + 1}등`}
                                            </td>
                                            <td>{record.date}</td>
                                            <td className="fw-bold text-primary fs-5">{record.score} 점</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </>
                )}
            </div>
        </Container>
    );
};

export default HistoryPage;