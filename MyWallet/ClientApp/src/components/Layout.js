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
                        <Row className="align-items-center">
                        <div onClick={switchDark} className={`switch-dark mt-2 ${dark ? "dark" :"light"}`}></div>
                            {props.children}
                        </Row>
                    </Container>
                </Container>
            </div>
        );
 

}