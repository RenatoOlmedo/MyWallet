import React, { Component } from 'react';

export class Card extends Component {
    static displayName = Card.name;

    render() {
        const { title, text,classeProps } = this.props;
        
        return (
            <div className={`card h-100 flex-1 ${classeProps}`}>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{text}</p>
                </div>
            </div>
        );
    }
}