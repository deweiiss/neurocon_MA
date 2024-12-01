import React, {Component} from "react";
import axios from "axios";

class SignupComponent extends Component {

    constructor(props) {
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeMail = this.onChangeMail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            userFullName: '',
            userMail: '',
            password: '',
            passwordConfirm: '',
            userRole: 'STANDARD',
            error: ''
        };
    }

    onChangeName(e) {
        this.setState({
            userFullName: e.target.value
        })
    }

    onChangeMail(e) {
        this.setState({
            userMail: e.target.value,
            error: ''
        })
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    onChangeConfirmPassword(e) {
        this.setState({
            passwordConfirm: e.target.value
        })
    }

    emailValidation() {
        const regex = /^(([^<>()[\],;:\s@]+(\.[^<>()[\],;:\s@]+)*)|(.+))@(([^<>()[\],;:\s@]+\.)+[^<>()[\],;:\s@]{2,})$/i;
        if (!this.state.userMail || regex.test(this.state.userMail) === false) {
            this.setState({
                error: "Email is not valid, please enter a correct one!",
                userMail: ''
            });
            return false;
        }
        return true;
    }

    componentDidMount() {
        sessionStorage.setItem('signedUp', 'false')
    }

    // TODO: set token
    onSubmit(e) {
        if (this.emailValidation()) {
            sessionStorage.setItem('signedUp', 'true')
            e.preventDefault();
            axios.post('http://localhost:5005/user/signup', this.state)
                .then((res) => {
                    console.log(res.data);
                    sessionStorage.setItem('token', res.data['token']);
                    sessionStorage.setItem('userMail', this.state.userMail);
                })
                .then(() => {
                    window.location.hash = "/"
                })
        } else {
            console.log("Email is not valid")
        }

    }

    render() {
        return (
            <div>
                <h3 className="h2 fw-bold text-center mt-3">Create Account</h3>
                <form className="form-group col-4 offset-4 text-start" onSubmit={this.onSubmit}>

                    <input
                        id="userFullName"
                        type="text"
                        placeholder="Name"
                        required
                        className="form-control mt-3 mb-3"
                        onChange={this.onChangeName}
                        value={this.state.userFullName}
                    />

                    <input
                        id="userMail"
                        type="text"
                        placeholder="Mail"
                        required
                        className="form-control mt-3 mb-3"
                        onChange={this.onChangeMail}
                        value={this.state.userMail}
                    />
                    <span className="text-danger">{this.state.error}</span>

                    <input
                        id="userPassword"
                        type="password"
                        required
                        placeholder="Password"
                        className="form-control mt-3 mb-3"
                        onChange={this.onChangePassword}
                        value={this.state.password}
                    />

                    <input
                        id="userPassword"
                        type="password"
                        required
                        placeholder="Confirm Password"
                        className="form-control mt-3 mb-3"
                        onChange={this.onChangeConfirmPassword}
                        value={this.state.passwordConfirm}
                    />

                    <input
                        id="loginConfirm"
                        value="Sign Up"
                        type="submit"
                        className="btn btn-primary fw-bold mt-3 col-5"
                    />
                </form>
            </div>
        )
    }
}

export default SignupComponent;