import React, {Component} from "react";
import FileUpload from "../modals/csv_modal_component";
import DBQueryPopup from "../modals/db_query_modal_component";

// TODO: create styling for popups
class InputDataOptions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showCSVPopup: false,
            showQueryPopup: false,
            data: ''
        }
    }

    toggleCSVPopup() {
        this.setState({
            showCSVPopup: !this.state.showCSVPopup,
            showQueryPopup: false
        });
    }

    toggleQueryPopup() {
        this.setState({
            showCSVPopup: false,
            showQueryPopup: !this.state.showQueryPopup
        });
    }

    //TODO: check if we need even this one here!!!
    /*onUploadAccepted(e) {
        this.setState({
            data: e
        })
    }*/

    //TODO: maybe reverse this and just submit within popup and remove "save name" by only adding it to sessionStorage where the others can access

    render() {
        return (
            <div className="text-center">
                <button className="btn btn-primary col-2 align-content-center fw-bold mx-3"
                        onClick={this.toggleCSVPopup.bind(this)}>Upload
                    CSV File
                </button>
                <button className="btn btn-primary col-2 align-content-center fw-bold mx-3"
                        onClick={this.toggleQueryPopup.bind(this)}>Query Database
                </button>
                {this.state.showCSVPopup ?
                    <FileUpload
                        closePopup={this.toggleCSVPopup.bind(this)}
                        //receiveCSVData={this.onUploadAccepted.bind(this)}
                    />
                    : null
                }
                {this.state.showQueryPopup ?
                    <DBQueryPopup
                        closePopup={this.toggleQueryPopup.bind(this)}
                    />
                    : null
                }
            </div>
        )
    }
}

export default InputDataOptions;