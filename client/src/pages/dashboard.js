import React, {Component} from "react";
import {ModelDashboard} from "../components/commons/table_component";
import NavbarComponent from "../components/commons/navbar_component";
import {Navigate} from "react-router-dom";

class DashboardPage extends Component {

    /*componentDidMount() {
        let loggedIn = sessionStorage.getItem('token');
        if (loggedIn === null) {
            window.location.hash = "/authentication";
        }
    }*/

    render() {
        const loggedIn = sessionStorage.getItem('token');
        if (!loggedIn) {
            return <Navigate to="/auth"/>
        }
        return (
            <div>
                <NavbarComponent/>
                <ModelDashboard/>
            </div>
        )
    }
}

export default DashboardPage;