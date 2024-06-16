import React, { Component } from 'react';

export class CardList extends Component {
    static displayName = CardList.name;

    render() {
        const { title, ops } = this.props;
        
        return (
            
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>

                    <ul className="list-group">
                        {ops.map((op, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between">
                                <span>{op.financialOperation}</span>
                                <span>{op.result}</span>
                            </li>
                        ))}
                    </ul>


                </div>
            </div>
        );
    }
}