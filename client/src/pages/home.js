import React, {Component} from "react";
import {ProjectSelection} from "../components/home/project_selection_component";
import {ModelDashboard} from "../components/commons/table_component";
import NavbarComponent from "../components/commons/navbar_component";
import {Navigate} from "react-router-dom";

class HomePage extends Component {

    /*componentDidMount() {
        let loggedIn = sessionStorage.getItem('token');
        if (!loggedIn) {
            return <Navigate to="/auth"/>
        }
    }*/

    render() {
        const loggedIn = sessionStorage.getItem('token');
        console.log("token: ", loggedIn);
        if (!loggedIn) {
            return <Navigate to="/auth"/>
        }
        return (
            <div>
                <NavbarComponent/>
                <ProjectSelection/>
                <ModelDashboard/>
            </div>
        )
    }
}

export default HomePage