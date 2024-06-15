import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export const Wallets = () => {
    const [userId, setUserId] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        month: '',
        amountInvested: '',
        deposits: '',
        withdrawals: '',
        currentHeritage: '',
        profit: '',
        operations: []
    });

    const {id} = useParams()
    
    const [newOperation, setNewOperation] = useState({
        financialOperation: '',
        result: '',
        status: 'Finalizada'
    });

    useEffect(() => {
        
        if (id) {
            setUserId(id);
            getWalletsData(id);
        }
    }, []);

    const getWalletsData = async (userId) => {
        try {
            const response = await fetch(`/wallet/listWallet?userId=${userId}`);
            const data = await response.json();
            console.log(data)
            setData(data);
        } catch (error) {
            console.error('Failed to fetch wallet data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOperationChange = (e) => {
        const { name, value } = e.target;
        setNewOperation({ ...newOperation, [name]: value });
    };

    const handleAddOperation = () => {
        setFormData({
            ...formData,
            operations: [...formData.operations, newOperation]
        });
        setNewOperation({ financialOperation: '', result: '', status: 'Finalizada' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/wallet/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, ...formData })
            });
            if (response.ok) {
                getWalletsData(userId);
                handleCloseModal();
            }
        } catch (error) {
            console.error('Failed to submit form:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h1>Wallets</h1>
            <Button onClick={handleShowModal}>Adicionar</Button>
            <ul className="list-group">
                {data.map((op, index) => (
                    <li key={index} className="list-group-item">{op.userName}</li>
                ))}
            </ul>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Wallet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formMonth">
                            <Form.Label>Mês</Form.Label>
                            <Form.Control as="select" name="month" value={formData.month} onChange={handleChange} required>
                                <option value="">Selecione o mês</option>
                                <option value="Janeiro">Janeiro</option>
                                <option value="Fevereiro">Fevereiro</option>
                                <option value="Março">Março</option>
                                <option value="Abril">Abril</option>
                                <option value="Maio">Maio</option>
                                <option value="Junho">Junho</option>
                                <option value="Julho">Julho</option>
                                <option value="Agosto">Agosto</option>
                                <option value="Setembro">Setembro</option>
                                <option value="Outubro">Outubro</option>
                                <option value="Novembro">Novembro</option>
                                <option value="Dezembro">Dezembro</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formAmountInvested">
                            <Form.Label>Valor Investido</Form.Label>
                            <Form.Control type="number" name="amountInvested" value={formData.amountInvested} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formDeposits">
                            <Form.Label>Depósitos</Form.Label>
                            <Form.Control type="number" name="deposits" value={formData.deposits} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formWithdrawals">
                            <Form.Label>Saques</Form.Label>
                            <Form.Control type="number" name="withdrawals" value={formData.withdrawals} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formCurrentHeritage">
                            <Form.Label>Patrimônio Atual</Form.Label>
                            <Form.Control type="number" name="currentHeritage" value={formData.currentHeritage} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formProfit">
                            <Form.Label>Lucro</Form.Label>
                            <Form.Control type="number" name="profit" value={formData.profit} onChange={handleChange} required />
                        </Form.Group>

                        <h5>Operações</h5>
                        {formData.operations.map((operation, index) => (
                            <div key={index} className="mb-3">
                                <strong>Operação {index + 1}</strong>
                                <div>Operação: {operation.financialOperation}</div>
                                <div>Resultado: {operation.result}</div>
                                <div>Status: {operation.status}</div>
                            </div>
                        ))}

                        <Form.Row>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Operação Financeira"
                                    name="financialOperation"
                                    value={newOperation.financialOperation}
                                    onChange={handleOperationChange}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="Resultado"
                                    name="result"
                                    value={newOperation.result}
                                    onChange={handleOperationChange}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={newOperation.status}
                                    onChange={handleOperationChange}
                                >
                                    <option value="Finalizada">Finalizada</option>
                                    <option value="Em andamento">Em andamento</option>
                                </Form.Control>
                            </Col>
                            <Col>
                                <Button variant="primary" onClick={handleAddOperation}>Adicionar Operação</Button>
                            </Col>
                        </Form.Row>

                        <Button variant="primary" type="submit">Salvar</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};