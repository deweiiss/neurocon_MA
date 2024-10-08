import React, {Component} from "react";
import InputData from "../components/input/input_params_component";
import QueryOptions from "../components/input/query_options_component";
import NavbarComponent from "../components/commons/navbar_component";


class InputPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    onBackClick() {
        window.location.hash = "/";
    }

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
                <button className="btn btn-secondary m-3 col-1" onClick={this.onBackClick}>Back</button>
                <InputData/>
                <br/>
                <QueryOptions/>
            </div>
        )
    }
}

export default InputPage;

