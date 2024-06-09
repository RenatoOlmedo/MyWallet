import React, { Component } from 'react';
import { NavMenu } from './NavMenu';
import { Container, Row } from 'reactstrap';

export class Layout extends Component {
    static displayName = Layout.name;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="dark">
                <NavMenu/>
                <Container fluid className="fundo-body">
                    <Container>
                        <Row className="align-items-center">
                            {this.props.children}
                        </Row>
                    </Container>
                </Container>
            </div>
        );
    }
}