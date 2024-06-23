import React, { Component } from 'react';

export class CardList extends Component {
    static displayName = CardList.name;

    render() {
        const { title, ops, classeProps } = this.props;
        
        return (
            <div className={`card ${classeProps}`}>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    {ops.length > 0 ? (
                        <ul className="list-group">
                            {ops.map((op, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between">
                                    <span>{op.financialOperation}</span>
                                    <span>{op.result}</span>
                                </li>
                            ))}
                        </ul>
                        ) : (
                            <p className="card-text">NÃO HÁ OPERAÇÕES</p>
                        )
                    }
                </div>
            </div>
        );
    }
}