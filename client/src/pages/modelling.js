import React, {Component} from "react";
import ModelParameters from "../components/modelling/model_params_component";
import NavbarComponent from "../components/commons/navbar_component";
import {Navigate} from "react-router-dom";

class ModellingPage extends Component {

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
                <ModelParameters/>
            </div>
        )
    }

}

export default ModellingPage