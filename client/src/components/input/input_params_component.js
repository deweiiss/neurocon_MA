import React, {Component} from "react";

class InputData extends Component {

    constructor(props) {
        super(props);
        this.onChangeModelName = this.onChangeModelName.bind(this);

        this.state = {
            redirect: false,
            userMail: '',
            modelName: '',
            disclaimer: ''
        }
    }

    onChangeModelName(e) {
        this.setState({
            modelName: e.target.value
        })
    }

    resetForm() {
        this.setState({
            modelName: "",
        })
    }

    componentDidMount() {
        if (sessionStorage.getItem('userMail') !== null) {
            this.setState({
                userMail: sessionStorage.getItem('userMail'),
                modelName: sessionStorage.getItem('modelName')
            })
        } else {
            this.resetForm();
        }
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log("Enter was pressed");
            this.setState({
                disclaimer: "Please upload your training data first!"
            });
        }
    }

    render() {
        sessionStorage.setItem('modelName', this.state.modelName);
        return (
            <div>
                <div className="contact">
                    <h2 className="text-center fw-bold">Create New Model</h2>
                </div>
                <div className="container-contact">
                    <form method="POST">
                        <div className="form-group col-4 offset-4 text-center">
                            <label htmlFor="modelNameInput">Please enter the Model Name: </label>
                            <input id="modelNameInput"
                                   type="text"
                                   required
                                   className="form-control"
                                   onChange={this.onChangeModelName}
                                   value={this.state.modelName}
                                   onKeyDown={this.handleKeyPress}
                            />
                            <div className="alert-warning">{this.state.disclaimer}</div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default InputData;


