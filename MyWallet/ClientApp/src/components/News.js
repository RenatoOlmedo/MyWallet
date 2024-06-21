import React, { Component } from 'react';

export class News extends Component {
    static displayName = News.name;

    render() {
        const { title, props, classeProps } = this.props;

        return (
            <div className={`card ${classeProps}`}>
                <h5 className="card-title  ps-3 pt-3">{title}</h5>
                <div className="card-body">
                    <ul className="list-group">
                        {props.map((prop, index) => (
                            <li key={index} className="list-group-item">
                                <h5 className="card-title">{prop.title}</h5>
                                <p className="card-text">{prop.body}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}