import React, {Component} from "react";
import {Nav, Navbar, NavDropdown} from 'react-bootstrap';


class NavbarComponent extends Component {

    // TODO: move elements to the right on navbar!!!!
    render() {
        let mail = sessionStorage.getItem('userMail');
        let loggedIn;
        loggedIn = sessionStorage.getItem('token') !== null;
        let component;
        let navCopy;
        if (loggedIn) {
            navCopy = <div className="text-light text-end">Logged in with: {mail}</div>
            component = <Nav.Link className="text-error text-end" href="#/logout">Logout</Nav.Link>
        } else {
            component = <Nav.Link className=" text-error text-end" href="#/auth">Login</Nav.Link>
        }
        return (
            <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                <Navbar.Brand className="mx-5 fw-bold" href="#home">NeuroCon</Navbar.Brand>
                {navCopy}
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className=" text-end">
                        <Nav.Link href="#/dashboard">Dashboard</Nav.Link>
                        {component}
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">TBD</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">TBD</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">TBD</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item href="#action/3.4">TBD</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

        )
    }
}

/* TODO: check if we need a search bar at later stage
<Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                        <Button variant="outline-success">Search</Button>
                    </Form>
 */

export default NavbarComponent;