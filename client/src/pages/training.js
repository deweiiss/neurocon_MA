import React, {Component} from "react";
import TrainingParameters from "../components/training/training_params_component";
import NavbarComponent from "../components/commons/navbar_component";

class TrainingPage extends Component {

    componentDidMount() {
        let loggedIn = sessionStorage.getItem('token');
        if (loggedIn === null) {
            window.location.hash = "/authentication";
        }
    }

    render() {
        return (
            <div>
                <NavbarComponent/>
                <TrainingParameters/>
            </div>
        )
    }

}

export default TrainingPage