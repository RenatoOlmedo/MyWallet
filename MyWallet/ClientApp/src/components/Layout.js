import React, { Component, useState } from 'react';
import { NavMenu } from './NavMenu';
import { Container, Row,Offcanvas,OffcanvasHeader,OffcanvasBody } from 'reactstrap';

export const Layout = (props) => {
        const [dark, setDark] = useState(true)

        function switchDark(){
            setDark(!dark)
        }
    

        return (
            <div className={dark ? "dark" : "light"}>
                <NavMenu/>
                <Container fluid className="fundo-body">
                    <Container>
                        <div onClick={switchDark} className={`switch-dark ${dark ? "dark" :"light"}`}></div>
                        <Row className="align-items-center">
                            {props.children}
                        </Row>
                    </Container>
                </Container>
            </div>
        );
 

}