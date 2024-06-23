import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import './NavMenu.css';
import authService from './api-authorization/AuthorizeService';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      isAdmin: false,
      isUser: false
    };
  }

  async componentDidMount() {
    const userRoles = await authService.getUserRoles();
    
    this.setState({ isAdmin: userRoles.includes('Admin') });
    this.setState({ isUser: userRoles.includes('User') });
  }
  
  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    const { isAdmin } = this.state;
    const { isUser } = this.state;
    
    return (
        <header>
          <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow" container light>
            <NavbarBrand tag={Link} to="/">MyWallet</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <LoginMenu>
                </LoginMenu>
              </ul>
            </Collapse>
          </Navbar>
        </header>
    );
  }
}
