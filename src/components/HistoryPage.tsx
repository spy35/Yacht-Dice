// src/components/HistoryPage.tsx
import { useState } from 'react';
import { Container, Table, Button, Nav, Badge } from 'react-bootstrap';
import Die from './Die';
import type { GameRecord, DuelRecord } from '../types/game';

type HistoryPageProps = {
    records: GameRecord[];
    duelRecords: DuelRecord[]; // ⭐️ 추가: 다이스 듀얼 기록 수신
    clearRecords: (type: 'yacht' | 'duel') => void; // ⭐️ 어떤 기록을 지울지 타입 전달 변경
    onSelectRecord: (record: GameRecord) => void;
};

const HistoryPage = ({ records, duelRecords, clearRecords, onSelectRecord }: HistoryPageProps) => {
    // 내부 탭 전환 상태 관리 ('yacht' | 'duel')
    const [activeTab, setActiveTab] = useState<'yacht' | 'duel'>('yacht');

    return (
        <Container className="py-4" style={{ maxWidth: '900px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark m-0">🏆 플레이 통합 대조실</h2>
                <Button 
                    variant="outline-danger" 
                    onClick={() => clearRecords(activeTab)} 
                    disabled={activeTab === 'yacht' ? records.length === 0 : duelRecords.length === 0}
                    className="fw-bold"
                >
                    {activeTab === 'yacht' ? '요트 기록 삭제' : '듀얼 기록 삭제'}
                </Button>
            </div>

            {/* 상단 서브 내비게이션 탭 메뉴 (부트스트랩 탭 레이아웃 재활용) */}
            <Nav variant="tabs" className="mb-4 fw-bold" activeKey={activeTab}>
                <Nav.Item>
                    <Nav.Link eventKey="yacht" onClick={() => setActiveTab('yacht')}>
                        🎲 요트 다이스 랭킹방 ({records.length})
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="duel" onClick={() => setActiveTab('duel')}>
                        ⚔️ 다이스 듀얼 전적실 ({duelRecords.length})
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            <div className="bg-white p-4 rounded border shadow-sm">
                {/* 탭 1: 요트 다이스 기록 리스트 */}
                {activeTab === 'yacht' && (
                    records.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <p className="fs-4 mb-0">🎲 아직 플레이한 요트 다이스 내역이 없습니다.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-start text-muted mb-2">💡 항목을 선택하면 당시 1~10턴의 진행 과정을 다시 슬라이드로 <b>복기</b>할 수 있습니다.</p>
                            <Table striped bordered hover responsive className="text-center align-middle mb-0">
                                <thead className="table-dark">
                                    <tr>
                                        <th style={{ width: '20%' }}>순위</th>
                                        <th style={{ width: '50%' }}>플레이 일시</th>
                                        <th style={{ width: '30%' }}>최종 총점</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...records]
                                        .sort((a, b) => b.score - a.score)
                                        .map((record, index) => (
                                            <tr key={record.id} onClick={() => onSelectRecord(record)} style={{ cursor: 'pointer' }}>
                                                <td className="fw-bold text-secondary">🥇 {index + 1}등</td>
                                                <td>{record.date}</td>
                                                <td className="fw-bold text-primary fs-5">{record.score} 점</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        </>
                    )
                )}

                {/* 탭 2: 다이스 듀얼 매치 기록 리스트 */}
                {activeTab === 'duel' && (
                    duelRecords.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <p className="fs-4 mb-0">⚔️ 컴퓨터 AI와 격돌한 배틀 기록이 존재하지 않습니다.</p>
                        </div>
                    ) : (
                        <Table striped bordered hover responsive className="text-center align-middle mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th style={{ width: '15%' }}>결과</th>
                                    <th style={{ width: '35%' }}>매치 성립 일시</th>
                                    <th style={{ width: '35%' }}>최종 주사위 스냅샷 (재사용)</th>
                                    <th style={{ width: '15%' }}>스코어</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...duelRecords].map((match) => {
                                    // 매치 승패 결과에 따른 부트스트랩 배지 컬러 매칭 분기
                                    const badgeColor = match.result === 'WIN' ? 'success' : match.result === 'LOSE' ? 'danger' : 'warning';
                                    const badgeText = match.result === 'WIN' ? 'WIN 승리' : match.result === 'LOSE' ? 'LOSE 패배' : 'DRAW 무승부';

                                    return (
                                        <tr key={match.id}>
                                            <td>
                                                <Badge bg={badgeColor} className="fs-6 py-2 px-3">{badgeText}</Badge>
                                            </td>
                                            <td style={{ fontSize: '0.9rem' }}>{match.date}</td>
                                            {/* ⭐️ 컴포넌트 극대화 재사용: 당시 주사위 눈금 3개씩을 미니 주사위(28px)로 가로 정렬 시각화 */}
                                            <td>
                                                <div className="d-flex flex-column align-items-center">
                                                    <div className="d-flex align-items-center mb-1">
                                                        <small className="text-primary me-2 fw-bold" style={{fontSize:'0.75rem'}}>YOU:</small>
                                                        {match.playerDice.map((v, i) => <Die key={i} die={{ value: v }} size="28px" />)}
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <small className="text-secondary me-2 fw-bold" style={{fontSize:'0.75rem'}}>COM:</small>
                                                        {match.computerDice.map((v, i) => <Die key={i} die={{ value: v }} size="28px" />)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="fw-bold text-dark">
                                                {match.playerSum} : {match.computerSum}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )
                )}
            </div>
        </Container>
    );
};

export default HistoryPage;