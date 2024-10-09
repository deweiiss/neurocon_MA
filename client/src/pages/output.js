import React, {Component} from "react";
import OutputGraphs from "../components/output/output_visualisation_component";
import NavbarComponent from "../components/commons/navbar_component";

class OutputPage extends Component {

    componentDidMount() {
        let loggedIn = sessionStorage.getItem('token');
        if (loggedIn === null) {
            window.location.hash = "/authentication";
        }
    }

//<CreateReport/>
    render() {
        return (
            <div>
                <NavbarComponent/>
                <OutputGraphs/>
            </div>
        )
    }
}

export default OutputPage