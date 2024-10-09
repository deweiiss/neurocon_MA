import React, {Component} from "react";
import {Accordion} from "react-bootstrap";
import axios from "axios";

class TrainingParameters extends Component {

    constructor(props) {
        super(props);

        this.onChangeApplicationType = this.onChangeApplicationType.bind(this);
        this.onChangeLearningRate = this.onChangeLearningRate.bind(this);
        this.onChangeEpochs = this.onChangeEpochs.bind(this);
        this.onChangeVerbosity = this.onChangeVerbosity.bind(this);
        this.onChangeBatchSize = this.onChangeBatchSize.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            userMail: sessionStorage.getItem('userMail'),
            modelName: sessionStorage.getItem('modelName'),
            modelId: sessionStorage.getItem('modelId'),
            reTrain: false,
            applicationType: 'train',
            learningRate: 0.001,
            epochs: 10000,
            verbosity: 0,
            batchSize: 0
        }

    }

    onChangeApplicationType(e) {
        this.setState({
            applicationType: e.target.value
        })
    }

    onChangeLearningRate(e) {
        this.setState({
            learningRate: e.target.value
        })
    }

    onChangeEpochs(e) {
        this.setState({
            epochs: e.target.value
        })
    }

    onChangeVerbosity(e) {
        this.setState({
            verbosity: e.target.value
        })
    }

    onChangeBatchSize(e) {
        this.setState({
            batchSize: e.target.value
        })
    }

    componentDidMount() {
        if (sessionStorage.getItem('paramsEntered') === 'true' || this.state.modelId.length === 24) {
            this.setState({
                reTrain: true
            })
            const params = {
                'modelId': this.state.modelId,
                'userMail': this.state.userMail
            }
            axios.get('http://localhost:5002/training/model', {params})
                .then((res) => {
                    console.log(res.data);
                })
        }
    }

    async onSubmit(e) {
        e.preventDefault();
        sessionStorage.removeItem('paramsEntered');
        axios.post('http://localhost:5002/training/train', this.state)
            .then((res) => {
                console.log(res.data);
            })
    }

    render() {
        let header;
        if (this.state.applicationType === 'train') {
            header = "Training";
        } else {
            header = "Evaluation"
        }
        return (
            <div>
                <h2>{header}</h2>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>{header} Parameters</Accordion.Header>
                        <Accordion.Body>
                            <form method="POST" onSubmit={this.onSubmit.bind(this)}>
                                <div className="form-group">
                                    <label htmlFor="appTypeInput">Application Type: </label>
                                    <select className="form-select" id="appTypeInput" value={this.state.applicationType}
                                            onChange={this.onChangeApplicationType}>
                                        <option value="train">Training</option>
                                        <option value="evaluate">Evaluation</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="batchSize">Batch Size: </label>
                                    <input id="batchSize"
                                           type="number"
                                           required
                                           className="form-control"
                                           value={this.state.batchSize}
                                           onChange={this.onChangeBatchSize}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="learningRateInput">Learning Rate: </label>
                                    <input id="learningRateInput"
                                           type="number"
                                           required
                                           className="form-control"
                                        //placeholder={0.001}
                                           value={this.state.learningRate}
                                           onChange={this.onChangeLearningRate}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="epochsInput">Epochs: </label>
                                    <input id="epochsInput"
                                           type="number"
                                           required
                                           className="form-control"
                                           value={this.state.epochs}
                                           onChange={this.onChangeEpochs}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="verbosityInput">Verbosity: </label>
                                    <input id="verbosityInput"
                                           type="number"
                                           required
                                           className="form-control"
                                           value={this.state.verbosity}
                                           onChange={this.onChangeVerbosity}
                                    />
                                </div>

                                <div className="form-group">
                                    <input type="submit" value="Pass Params" className="btn btn-primary"/>
                                </div>
                            </form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        )
    }
}

export default TrainingParameters;