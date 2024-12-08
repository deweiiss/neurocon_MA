import React, {Component} from "react";

class LogoutComponent extends Component {

    componentDidMount() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userMail');
        window.location.hash = "/";
    }

    render() {
        return (
            <div>
                <h3 className="h3">Logging out...</h3>
            </div>
        )
    }
}

export default LogoutComponent;