import React, {Component} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const Models = props => {
    console.log(props.model)
    let status = props.model.status;
    // some status emojis
    let progressEmoji;
    if (status === "training_complete") {
        progressEmoji = <div>&#x2705;</div>
    } else {
        progressEmoji = <div>&#x274C;</div>
    }

    let dateRaw = props.model.createdAt_new;
    let date = new Date(dateRaw)
    const isoDateRaw = date.toISOString();
    const isoDate = isoDateRaw.replace('T', ' at ').replace('Z', '').slice(0, -4)


    let updatedRaw = props.model.updatedAt_new;
    let isoUpdate = "---"
    if (dateRaw !== updatedRaw) {
        let updated = new Date(updatedRaw)
        const isoUpdateRaw = updated.toISOString();
        isoUpdate = isoUpdateRaw.replace('T', ' at ').replace('Z', '').slice(0, -4)
    }


    function setSessionStorage(modelId, modelName) {
        sessionStorage.setItem('modelId', modelId);
        sessionStorage.setItem('modelName', modelName)
    }

    function deleteModel(modelName) {
        let vals = {
            'modelName': modelName
        }
        axios.post('http://localhost:5002/training/model/delete', vals)
            .then(res => {
                console.log(res.data)
            });
        // TODO: check if we can find a more suitable solution for this - maybe just update the component
        window.location.reload();
    }

    return (
        <tr>
            <td className="align-middle text-center">{props.model.modelName}</td>
            <td className="align-middle text-center">{isoDate}</td>
            <td className="align-middle text-center">{isoUpdate}</td>
            <td className="align-middle text-center">{progressEmoji}</td>
            <td>
                <Link to={"/output"}
                      onClick={() => setSessionStorage(String(props.model._id.$oid), props.model.modelName)}>
                    <button className="btn btn-primary w-100">View Output</button>
                </Link>
            </td>
            <td>
                <Link to={"/training"}
                      onClick={() => setSessionStorage(String(props.model._id.$oid), props.model.modelName)}>
                    <button className="btn btn-secondary w-100">Run Again</button>
                </Link>
            </td>
            <td>
                <button onClick={() => deleteModel(props.model.modelName)} className="btn btn-danger w-100">Delete
                </button>
            </td>
        </tr>
    )
}


class ModelDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            models: []
        }
        this.getModel = this.getModel.bind(this);
    }

    componentDidMount() {
        let params = {
            userMail: sessionStorage.getItem('userMail')
        }
        axios.get('http://localhost:5002/training/models/', {params})
            .then(res => {
                this.setState({
                    models: res.data
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    getModel(id) {
        let params = {
            model: id,
            userMail: sessionStorage.getItem('userMail')
        }
        console.log("ID: " + id)
        axios.get('http://localhost:5002/training/model/', {params})
            .then(res => {
                console.log(res.data)
            });
        this.setState({
            models: this.state.models.filter(el => el._id !== id)
        })
    }

    modelList() {
        return this.state.models.map((currentModel, idx) => {
            return <Models model={currentModel} getModel={this.getModel} key={currentModel._id}/>
        })
    }

    render() {
        return (
            <div>
                <h3 className="text-center mb-3">Model Overview</h3>
                <table className="table bg-light">
                    <thead className="thead-light mb-2">
                    <tr className="mt-1">
                        <th>Model Name</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Status</th>
                        <th></th>
                        <th>Actions</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody className="mt-3">
                    {this.modelList()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export {ModelDashboard};