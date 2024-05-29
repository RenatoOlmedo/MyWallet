import React, { Component } from 'react';

export class News extends Component {
    static displayName = News.name;

    render() {
        const { props } = this.props;

        return (
            <div className="card">
                <div className="card-body">
                    <ul className="list-group">
                        {props.map((prop, index) => (
                            <li key={index} className="list-group-item">
                                <h5 className="card-title">{prop.Title}</h5>
                                <p className="card-text">{prop.Body}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}