import React, { Component } from 'react';
function valorFormatado(valor){
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}


export class CardList extends Component {
    static displayName = CardList.name;


 

    render() {
        const { title, ops, classeProps } = this.props;
        
        return (
            <div className={`card ${classeProps}`}>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    {(ops != null && ops.length > 0 )? (
                        <ul className="list-group">
                            {ops.map((op, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between">
                                    <span>{op.financialOperation}</span>
                                    <span>{valorFormatado(op.result)}</span>
                                </li>
                            ))}
                        </ul>
                        ) : (
                            <div className='d-flex justify-content-center align-items-center text-center h-75'>
                                <p className="card-text">NÃO HÁ OPERAÇÕES</p>   
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}