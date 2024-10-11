import React, {Component} from "react";
import axios from "axios";
import {Accordion} from "react-bootstrap";
import Select from "react-select";
import InputLayerParameters from "./model_inputlayer_params_component";
import HiddenLayerParameters from "./model_hiddenlayer_params_component";
import OutputLayerParameters from "./model_outputlayer_params_component";

class ModelParameters extends Component {

    constructor(props) {
        super(props);

        this.onChangeLayerNodeInformation = this.onChangeLayerNodeInformation.bind(this);
        this.addFormFields = this.addFormFields.bind(this);
        this.removeFormFields = this.removeFormFields.bind(this);
        this.onChangeModelName = this.onChangeModelName.bind(this);
        this.onChangeLossFunction = this.onChangeLossFunction.bind(this);
        this.onChangeOptimizer = this.onChangeOptimizer.bind(this);
        this.onChangeMetrics = this.onChangeMetrics.bind(this);
        this.onChangeClassNameGeneral = this.onChangeClassNameGeneral.bind(this);
        this.onChangeClassNameLayer = this.onChangeClassNameLayer.bind(this);
        this.onChangeTrainable = this.onChangeTrainable.bind(this);
        this.onChangeBatchInputShape = this.onChangeBatchInputShape.bind(this);
        this.onChangeDTypeInput = this.onChangeDTypeInput.bind(this);
        this.onChangeActivation = this.onChangeActivation.bind(this);
        this.onChangeSparse = this.onChangeSparse.bind(this);
        this.onChangeRagged = this.onChangeRagged.bind(this);
        this.onChangeDType = this.onChangeDType.bind(this);
        this.onChangeUseBias = this.onChangeUseBias.bind(this);
        this.onChangeOutputActivation = this.onChangeOutputActivation.bind(this);
        this.onChangeDTypeOutput = this.onChangeDTypeOutput.bind(this);
        this.onChangeUseBiasOutput = this.onChangeUseBiasOutput.bind(this);
        this.onChangeKernelInitializer = this.onChangeKernelInitializer.bind(this);
        this.onChangeBiasInitializer = this.onChangeBiasInitializer.bind(this);
        this.onChangeKernelRegularizer = this.onChangeKernelRegularizer.bind(this);
        this.onChangeBiasRegularizer = this.onChangeBiasRegularizer.bind(this);
        this.onChangeActivityRegularizer = this.onChangeActivityRegularizer.bind(this);
        this.onChangeKernelConstraint = this.onChangeKernelConstraint.bind(this);
        this.onChangeBiasConstraint = this.onChangeBiasConstraint.bind(this);

        this.state = {
            layerNodeInformation: [
                {layer: 0, nodes: 0},
                {layer: 1, nodes: 0},
                {layer: 2, nodes: 0},
            ],
            //layerNodeDict: {},
            layers: 0,
            userMail: sessionStorage.getItem('userMail'),
            modelName: sessionStorage.getItem('modelName'),
            lossFunction: 'binary_crossentropy',
            optimizer: 'adam',
            metrics: [],
            class_name_general: 'Sequential',
            class_name_layer: 'Dense',
            trainable: true,
            batch_input_shape: [],
            sparse: false,
            ragged: false,
            dtype_input: 'float32',
            activation: 'relu',
            dtype: 'float32',
            use_bias: true,
            activation_output: 'relu',
            use_bias_output: true,
            dtype_output: 'float32',
            kernel_initializer: null,
            bias_initializer: null,
            kernel_regularizer: null,
            bias_regularizer: null,
            activity_regularizer: null,
            kernel_constraint: null,
            bias_constraint: null,
            metricOptions: [
                {value: "accuracy", label: "Accuracy"},
                {value: "precision", label: "Precision"},
                {value: "binary_accuracy", label: "Binary Accuracy"},
                {value: "categorical_accuracy", label: "Categorical Accuracy"},
                {value: "sparse_categorical_accuracy", label: "Sparse Categorical Accuracy"},
                {value: "top_k_categorical_accuracy", label: "Top K Categorical Accuracy"},
                {value: "sparse_top_k_categorical_accuracy", label: "Sparse Top K Categorical Accuracy"},
                {value: "binary_crossentropy", label: "Binary Crossentropy"},
                {value: "categorical_crossentropy", label: "Categorical Crossentropy"},
                {value: "sparse_categorical_crossentropy", label: "Sparse Categorical Crossentropy"},
                {value: "kullback_leibler_divergence", label: "KL Divergence"},
                {value: "poisson", label: "Poisson"},
                {value: "mean_squared_error", label: "Mean Squared Error"},
                {value: "root_mean_squared_error", label: "Root Mean Squared Error"},
                {value: "mean_absolute_error", label: "Mean Absolute Error"},
                {value: "mean_absolute_percentage_error", label: "Mean Absolute Percentage Error"},
                {value: "mean_squared_logarithmic_error", label: "Mean Squared Logarithmic Error"},
                {value: "cosine_similarity", label: "Cosine Similarity"},
                {value: "logcosh", label: "Log Cos Error"},
                {value: "recall", label: "Recall"},
                {value: "true_positives", label: "True Positives"},
                {value: "true_negatives", label: "True Negatives"},
                {value: "false_positives", label: "False Positives"},
                {value: "false_negatives", label: "False Negatives"},
                {value: "precision_at_recall", label: "Precision At Recall"},
                {value: "sensitivity_at_specificity", label: "Sensitivity At Specificity"},
                {value: "specificity_at_sensitivity", label: "Specificity At Sensitivity"},
            ]
        }
    }

    onChangeLayerNodeInformation(index, e) {
        let layerNodeInformation = this.state.layerNodeInformation;
        layerNodeInformation[index][e.target.name] = e.target.value;
        let size = Object.keys(layerNodeInformation).length;
        this.setState({
            layerNodeInformation: layerNodeInformation,
            layers: size
        });
        //console.log(layerNodeInformation)
    }

    // for dynamic layer form
    addFormFields(){
      let map = this.state.layerNodeInformation;
      let size = Object.keys(map).length;
      this.setState({
          layerNodeInformation: [...this.state.layerNodeInformation, {layer: size, nodes: 0}]
      })
    }

    // for dynamic layer form
    removeFormFields(index) {
        let values = this.state.layerNodeInformation;
        values.splice(index, 1);
        this.setState({
            layerNodeInformation: values
        })
    }

    onChangeModelName(e) {
        this.setState({
            modelName: e.target.value
        })
    }

    onChangeLossFunction(e) {
        this.setState({
            lossFunction: e.target.value
        })
    }

    onChangeOptimizer(e) {
        this.setState({
            optimizer: e.target.value
        })
    }

    onChangeMetrics(e) {
        this.setState(() => {
            return {
                metrics: e
            };
        });
    }


    onChangeClassNameGeneral(e) {
        this.setState({
            class_name_general: e.target.value
        })
    }

    onChangeClassNameLayer(e) {
        this.setState({
            class_name_layer: e.target.value
        })
    }

    onChangeTrainable(e) {
        this.setState({
            trainable: e.target.value
        })
    }

    onChangeBatchInputShape(e) {
        let batchInputShape = e.target.value.split(",")
        this.setState({
            batch_input_shape: batchInputShape
        })
    }

    onChangeDTypeInput(e) {
        this.setState({
            dtype_input: e.target.value
        })
    }

    onChangeActivation(e) {
        this.setState({
            activation: e.target.value
        })
    }


    onChangeSparse(e) {
        this.setState({
            sparse: e.target.value
        })
    }

    onChangeRagged(e) {
        this.setState({
            ragged: e.target.value
        })
    }

    onChangeDType(e) {
        this.setState({
            dtype: e.target.value
        })
    }

    onChangeUseBias(e) {
        this.setState({
            use_bias: e.target.value
        })
    }

    onChangeOutputActivation(e) {
        this.setState({
            activation_output: e.target.value
        })
    }

    onChangeDTypeOutput(e) {
        this.setState({
            dtype_output: e.target.value
        })
    }

    onChangeUseBiasOutput(e) {
        this.setState({
            use_bias_output: e.target.value
        })
    }

    onChangeKernelInitializer() {
        this.setState({
            kernel_initializer: !this.state.kernel_initializer
        });
    }

    onChangeBiasInitializer() {
        this.setState({
            bias_initializer: !this.state.bias_initializer
        });
    }

    onChangeKernelRegularizer() {
        this.setState({
            bias_initializer: !this.state.bias_initializer
        });
    }

    onChangeBiasRegularizer() {
        this.setState({
            bias_regularizer: !this.state.bias_regularizer
        });
    }

    onChangeActivityRegularizer() {
        this.setState({
            activity_regularizer: !this.state.activity_regularizer
        });
    }

    onChangeKernelConstraint() {
        this.setState({
            kernel_constraint: !this.state.kernel_constraint
        });
    }

    onChangeBiasConstraint() {
        this.setState({
            bias_constraint: !this.state.bias_constraint
        });
    }

    async onSubmit(e) {
        e.preventDefault();
        this.setState({
            userMail: sessionStorage.getItem('userMail')
        })
        sessionStorage.setItem('modelName', this.state.modelName);
        sessionStorage.setItem('paramsEntered', 'true');

        axios.post('http://localhost:5002/training/createmodel', this.state)
            .then((res) => {
                console.log(res.data)
            })
            .then(() => {
                window.location.hash = "/training"
            });
    }

    onBackClick() {
        window.location.hash = "/input";
    }

    render() {
        return (
            <div>
                <button className="btn btn-secondary m-3" onClick={this.onBackClick}>Back</button>
                <h2 className="mx-md-5 mb-3 fw-bold">Enter Model Parameters for: {sessionStorage.getItem('modelName')}
                </h2>
                <form method="POST" onSubmit={this.onSubmit.bind(this)} className="mx-md-5">
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>General</Accordion.Header>
                            <Accordion.Body>

                                <div className="form-group">
                                    <label htmlFor="classNameGeneralInput">Model Type: </label>
                                    <input id="classNameGeneralInput"
                                           type="text"
                                           required
                                           className="form-control"
                                           onChange={this.onChangeClassNameGeneral}
                                           value={this.state.class_name_general}
                                           readOnly={true}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="layerNameInput">Layer Type: </label>
                                    <select className="form-select" id="layerNameInput"
                                            value={this.state.class_name_layer}
                                            onChange={this.onChangeClassNameLayer}>
                                        <option value="Dense">Dense</option>
                                        <option value="Activation">Activation</option>
                                        <option value="Embedding">Embedding</option>
                                        <option value="Masking">Masking</option>
                                        <option value="Lamda">Lambda</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="trainableInput">Trainable: </label>
                                    <input id="trainableInput"
                                           type="text"
                                           required
                                           readOnly={true}
                                           className="form-control"
                                           onChange={this.onChangeTrainable}
                                           value={this.state.trainable}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="optimizerInput">Optimizer: </label>
                                    <select className="form-select" id="optimizerInput"
                                            value={this.state.optimizer}
                                            onChange={this.onChangeOptimizer}>
                                        <option value="adam">Adam</option>
                                        <option value="adadelta">Adadelta</option>
                                        <option value="adamax">Adamax</option>
                                        <option value="ftrl">Ftrl</option>
                                        <option value="nadam">Nadam</option>
                                        <option value="rmsprop">RMSprop</option>
                                        <option value="SGD">SGD</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lossFunctionInput">Loss Function: </label>
                                    <select className="form-select" id="lossFunctionInput"
                                            value={this.state.lossFunction}
                                            onChange={this.onChangeLossFunction}>

                                        <option value="binary_crossentropy">Binary Crossentropy
                                        </option>
                                        <option value="binary_focal_crossentropy">Binary Focal Crossentropy</option>
                                        <option value="categorical_crossentropy">Categorical Crossentropy</option>
                                        <option value="categorical_hinge">Categorical Hinge</option>
                                        <option value="cosine_similarity">Cosine Similarity</option>
                                        <option value="hinge">Hinge</option>
                                        <option value="huber">Huber</option>
                                        <option value="kl_divergence">KL Divergence</option>
                                        <option value="log_cosh">Log Cosh</option>
                                        <option value="loss">Loss</option>
                                        <option value="mean_absolute_error">Mean Absolute Error</option>
                                        <option value="mean_absolute_percentage_error">Mean Absolute Percentage
                                            Error
                                        </option>
                                        <option value="mean_squared_error">Mean Squared Error</option>
                                        <option value="mean_squared_logarithmic_error">Mean Squared Logarithmic
                                            Error
                                        </option>
                                        <option value="poisson">Poisson</option>
                                        <option value="reduction">Reduction</option>
                                        <option value="sparse_categorical_crossentropy">Sparse Categorical
                                            Crossentropy
                                        </option>
                                        <option value="squared_hinge">Squared Hinge</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="metricsInput">Metrics:</label>
                                    <Select
                                        name="Metrics"
                                        placeholder="Select metrics..."
                                        value={this.state.metrics}
                                        options={this.state.metricOptions}
                                        onChange={this.onChangeMetrics}
                                        isMulti
                                        isSeachable
                                    />
                                </div>

                                <div className="btn btn-secondary" onClick={() => this.addFormFields()}>Add Layer</div>
                                {this.state.layerNodeInformation.map((element, index) => (
                                    <div className="form-group form-inline" key={index}>
                                        <input
                                            readOnly={true}
                                            id="layers"
                                            type="text"
                                            name="layer"
                                            value={index + 1}
                                            onChange={e => this.onChangeLayerNodeInformation(index, e)}
                                        />
                                        <input
                                            required
                                            id="nodes"
                                            type="number"
                                            name="nodes"
                                            placeholder={"Number of nodes"}
                                            value={element.nodes || ""}
                                            onChange={e => this.onChangeLayerNodeInformation(index, e)}
                                        />
                                        {
                                            index > 2 ?
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => this.removeFormFields()}
                                                >
                                                    Remove Layer
                                                </button>
                                                : null
                                        }
                                    </div>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Input Layer</Accordion.Header>
                            <Accordion.Body>

                                <InputLayerParameters
                                    batch_input_shape={this.state.batch_input_shape}
                                    sparse_input={this.state.sparse}
                                    ragged_input={this.state.ragged}
                                    dtype_input={this.state.dtype_input}
                                    onChangeBatchInputShape={this.onChangeBatchInputShape}
                                    onChangeSparseInput={this.onChangeSparse}
                                    onChangeRaggedInput={this.onChangeRagged}
                                    onChangeDTypeInput={this.onChangeDTypeInput}
                                />


                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Hidden Layers</Accordion.Header>
                            <Accordion.Body>
                                <HiddenLayerParameters
                                    activation={this.state.activation}
                                    dtype={this.state.dtype}
                                    use_bias={this.state.use_bias}
                                    onChangeActivation={this.onChangeActivation}
                                    onChangeDType={this.onChangeDType}
                                    onChangeUseBias={this.onChangeUseBias}
                                />

                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Output Layer</Accordion.Header>
                            <Accordion.Body>
                                <OutputLayerParameters
                                    activation_output={this.state.activation_output}
                                    use_bias_output={this.state.use_bias_output}
                                    dtype_output={this.state.dtype_output}
                                    onChangeOutputActivation={this.onChangeOutputActivation}
                                    onChangeUseBiasOutput={this.onChangeUseBiasOutput}
                                    onChangeDTypeOutput={this.onChangeDTypeOutput}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <div className="form-group">
                        <input type="submit" value="Pass Model Parameters" className="btn btn-primary mt-3 fw-bold"/>
                    </div>
                </form>

            </div>
        )
    }
}

export default ModelParameters;