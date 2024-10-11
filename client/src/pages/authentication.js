import React, {Component} from "react";
import LoginComponent from "../components/user/login_component";
import SignupComponent from "../components/user/signup_component";
import NavbarComponent from "../components/commons/navbar_component";

class AuthenticationPage extends Component {
    constructor(props) {
        super(props);
        this.onChangeComponentControl = this.onChangeComponentControl.bind(this);

        this.state = {
            signedUp: sessionStorage.getItem('signedUp'),
            componentControl: true
        }
    }

    onChangeComponentControl(e) {
        this.setState({
            componentControl: !this.state.componentControl
        })
    }


    render() {
        let component;
        let footerCopy;
        let buttonCopy;
        if (this.state.componentControl === true) {
            footerCopy = "No account yet?"
            buttonCopy = "Create account"
            component = <LoginComponent/>
        } else {
            footerCopy = "Got an account already?"
            buttonCopy = "Login"
            component = <SignupComponent/>
        }
        return (
            <div>
                <NavbarComponent/>
                {component}
                <div className="col-4 offset-4 mt-2">
                    {footerCopy}
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="btn link-primary mb-1 text-decoration-underline"
                       onClick={this.onChangeComponentControl}>{buttonCopy}</a>
                </div>

            </div>
        )

    }

}

export default AuthenticationPage;