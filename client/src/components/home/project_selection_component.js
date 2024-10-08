import React, {Component} from "react";
import {Link} from "react-router-dom";

class ProjectSelection extends Component {

    constructor(props) {
        super(props);

        this.onLoadProjectClick = this.onLoadProjectClick.bind(this);

        this.state = {
            userMail: '1234',
            modelName: 'modelmodelmodel',
        }
    }
    // todo: check what this is
    onLoadProjectClick() {
        console.log("ON CLICK IT SHOULD OPEN A POPUP");
    }

    render() {
        return (
            <div className="container-fluid">
                <h1 className="fw-bold text-center mt-3">NEUROCON</h1>
                <p className="text-center">
                    You can choose to create a new model or load an existing one.
                </p>
                <div className="container text-center pb-3">
                    <Link className="btn btn-primary mx-3 mb-3 col-2 fw-bold" to="/input">New
                        Model</Link>
                    <button className="btn btn-secondary mx-3 mb-3 col-2 fw-bold"
                            onClick={this.onLoadProjectClick}>
                        Open Project
                    </button>
                </div>
            </div>
        )
    }
}

export {ProjectSelection};