import React, { Component } from 'react';
import { NavMenu } from './NavMenu';
import { Container } from 'reactstrap';

export class Layout extends Component {
    static displayName = Layout.name;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavMenu/>
                <Container>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}