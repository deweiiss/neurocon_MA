import React, {Component} from "react";
import axios from "axios";

class LoginComponent extends Component {

    constructor(props) {
        super(props);

        this.onChangeMail = this.onChangeMail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            userMail: '',
            password: '',
            loginSuccessful: true
        }
    }

    onChangeMail(e) {
        this.setState({
            userMail: e.target.value
        })
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    componentDidMount() {
        sessionStorage.setItem('signedUp', 'true')
    }

    onSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:5005/user/login', this.state)
            .then((res) => {
                console.log(res.data);
                if (res.status === 200) {
                    sessionStorage.setItem('token', res.data['token']);
                    sessionStorage.setItem('userMail', this.state.userMail);
                    window.location.hash = "/"
                } else {
                    this.setState({
                        loginSuccessful: false
                    })
                    // TODO: do it as in input_params_component with the disclaimer!!!
                    console.log(this.state.loginSuccessful)
                }
            })
            .catch((error) => {
                console.error({error});
            })
    }


    render() {
        return (
            <div>
                <h3 className="h2 fw-bold text-center mt-3">Login</h3>
                <form className="form-group col-4 offset-4 text-start" onSubmit={this.onSubmit}>
                    <input
                        id="userMail"
                        type="text"
                        placeholder="Enter your mail"
                        required
                        className="form-control form-control-lg mt-3 mb-3"
                        onChange={this.onChangeMail}
                        value={this.state.userMail}
                    />

                    <input
                        id="userPassword"
                        type="password"
                        required
                        placeholder="Enter your password"
                        className="form-control form-control-lg mt-3 mb-3"
                        onChange={this.onChangePassword}
                        value={this.state.password}
                    />

                    <input
                        id="loginConfirm"
                        value="Login"
                        type="submit"
                        required
                        className="btn btn-primary fw-bold mt-3 col-5"
                    />
                </form>
            </div>
        )
    }
}

export default LoginComponent;