import React, { useState, useEffect } from "react";
import axios from "axios";
import { Accordion } from "react-bootstrap";
import Select from "react-select";
import InputLayerParameters from "./model_inputlayer_params_component";
import HiddenLayerParameters from "./model_hiddenlayer_params_component";
import OutputLayerParameters from "./model_outputlayer_params_component";
import {Navigate} from "react-router-dom";

const METRIC_OPTIONS = [
  { value: "accuracy", label: "Accuracy" },
  { value: "precision", label: "Precision" },
  { value: "binary_accuracy", label: "Binary Accuracy" },
  { value: "categorical_accuracy", label: "Categorical Accuracy" },
  { value: "sparse_categorical_accuracy", label: "Sparse Categorical Accuracy" },
  { value: "top_k_categorical_accuracy", label: "Top K Categorical Accuracy" },
  { value: "sparse_top_k_categorical_accuracy", label: "Sparse Top K Categorical Accuracy" },
  { value: "binary_crossentropy", label: "Binary Crossentropy" },
  { value: "categorical_crossentropy", label: "Categorical Crossentropy" },
  { value: "sparse_categorical_crossentropy", label: "Sparse Categorical Crossentropy" },
  { value: "kullback_leibler_divergence", label: "KL Divergence" },
  { value: "poisson", label: "Poisson" },
  { value: "mean_squared_error", label: "Mean Squared Error" },
  { value: "root_mean_squared_error", label: "Root Mean Squared Error" },
  { value: "mean_absolute_error", label: "Mean Absolute Error" },
  { value: "mean_absolute_percentage_error", label: "Mean Absolute Percentage Error" },
  { value: "mean_squared_logarithmic_error", label: "Mean Squared Logarithmic Error" },
  { value: "cosine_similarity", label: "Cosine Similarity" },
  { value: "logcosh", label: "Log Cos Error" },
  { value: "recall", label: "Recall" },
  { value: "true_positives", label: "True Positives" },
  { value: "true_negatives", label: "True Negatives" },
  { value: "false_positives", label: "False Positives" },
  { value: "false_negatives", label: "False Negatives" },
  { value: "precision_at_recall", label: "Precision At Recall" },
  { value: "sensitivity_at_specificity", label: "Sensitivity At Specificity" },
  { value: "specificity_at_sensitivity", label: "Specificity At Sensitivity" },
];

const ModelParameters = () => {
  const [layerNodeInformation, setLayerNodeInformation] = useState([
    { layer: 0, nodes: 0 },
    { layer: 1, nodes: 0 },
    { layer: 2, nodes: 0 },
  ]);
  const [layers, setLayers] = useState(3);
  const [modelName, setModelName] = useState(sessionStorage.getItem("modelName"));
  const [lossFunction, setLossFunction] = useState("binary_crossentropy");
  const [optimizer, setOptimizer] = useState("adam");
  const [metrics, setMetrics] = useState([]);
  const [inputLayer, setInputLayer] = useState({
    batch_input_shape: [],
    dtype: "float32",
    sparse: false,
    ragged: false,
  });
  const [outputLayer, setOutputLayer] = useState({
    activation: "relu",
    dtype: "float32",
    use_bias: true,
  });
  const [redirect, setRedirect] = useState(false);


  useEffect(() => {
    const loggedIn = sessionStorage.getItem("token");
    if (!loggedIn) {
      setRedirect(true);
    }
  }, []);

  if (redirect) {
    return <Navigate to="/auth" />;
  }

  const handleChange = (field, setter) => (e) => {
    setter(e.target.value);
  };

  const onChangeLayerNodeInformation = (index, e) => {
    const updatedInfo = [...layerNodeInformation];
    updatedInfo[index][e.target.name] = e.target.value;
    setLayerNodeInformation(updatedInfo);
    setLayers(updatedInfo.length);
  };

  const addFormFields = () => {
    setLayerNodeInformation((prev) => [...prev, { layer: layers, nodes: 0 }]);
  };

  const removeFormFields = (index) => {
    setLayerNodeInformation((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    sessionStorage.setItem("modelName", modelName);
    sessionStorage.setItem("paramsEntered", "true");

    try {
      const res = await axios.post("http://localhost:5002/training/createmodel", {
        layerNodeInformation,
        modelName,
        lossFunction,
        optimizer,
        metrics,
        inputLayer,
        outputLayer,
      });
      console.log(res.data);
      window.location.hash = "/training";
    } catch (error) {
      console.error("Error creating model:", error);
    }
  };

  const onBackClick = () => {
    window.location.hash = "/input";
  };

  return (
    <div>
      <button className="btn btn-secondary m-3" onClick={onBackClick}>
        Back
      </button>
      <h2 className="mx-md-5 mb-3 fw-bold">
        Enter Model Parameters for: {modelName}
      </h2>
      <form method="POST" onSubmit={onSubmit} className="mx-md-5">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>General</Accordion.Header>
            <Accordion.Body>
              <div className="form-group">
                <label htmlFor="classNameGeneralInput">Model Type: </label>
                <input
                  id="classNameGeneralInput"
                  type="text"
                  required
                  className="form-control"
                  value="Sequential"
                  readOnly={true}
                />
              </div>

              <div className="form-group">
                <label htmlFor="layerNameInput">Layer Type: </label>
                <select
                  className="form-select"
                  id="layerNameInput"
                  value="Dense"
                  onChange={handleChange("class_name_layer", setOptimizer)}
                >
                  <option value="Dense">Dense</option>
                  <option value="Activation">Activation</option>
                  <option value="Embedding">Embedding</option>
                  <option value="Masking">Masking</option>
                  <option value="Lambda">Lambda</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="optimizerInput">Optimizer: </label>
                <select
                  className="form-select"
                  id="optimizerInput"
                  value={optimizer}
                  onChange={handleChange("optimizer", setOptimizer)}
                >
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
                <select
                  className="form-select"
                  id="lossFunctionInput"
                  value={lossFunction}
                  onChange={handleChange("lossFunction", setLossFunction)}
                >
                  <option value="binary_crossentropy">Binary Crossentropy</option>
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
                  <option value="mean_absolute_percentage_error">
                    Mean Absolute Percentage Error
                  </option>
                  <option value="mean_squared_error">Mean Squared Error</option>
                  <option value="mean_squared_logarithmic_error">
                    Mean Squared Logarithmic Error
                  </option>
                  <option value="poisson">Poisson</option>
                  <option value="reduction">Reduction</option>
                  <option value="sparse_categorical_crossentropy">
                    Sparse Categorical Crossentropy
                  </option>
                  <option value="squared_hinge">Squared Hinge</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="metricsInput">Metrics:</label>
                <Select
                  name="Metrics"
                  placeholder="Select metrics..."
                  value={metrics}
                  options={METRIC_OPTIONS}
                  onChange={(selected) => setMetrics(selected)}
                  isMulti
                  isSearchable
                />
              </div>

              <div className="btn btn-secondary" onClick={addFormFields}>
                Add Layer
              </div>
              {layerNodeInformation.map((element, index) => (
                <div className="form-group form-inline" key={index}>
                  <input
                    readOnly={true}
                    id="layers"
                    type="text"
                    name="layer"
                    value={index + 1}
                    onChange={(e) => onChangeLayerNodeInformation(index, e)}
                  />
                  <input
                    required
                    id="nodes"
                    type="number"
                    name="nodes"
                    placeholder={"Number of nodes"}
                    value={element.nodes || ""}
                    onChange={(e) => onChangeLayerNodeInformation(index, e)}
                  />
                  {index > 2 ? (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeFormFields(index)}
                    >
                      Remove Layer
                    </button>
                  ) : null}
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Input Layer</Accordion.Header>
            <Accordion.Body>
              <InputLayerParameters
                batch_input_shape={inputLayer.batch_input_shape}
                sparse_input={inputLayer.sparse}
                ragged_input={inputLayer.ragged}
                dtype_input={inputLayer.dtype}
                onChangeBatchInputShape={(e) =>
                  setInputLayer({ ...inputLayer, batch_input_shape: e.target.value.split(",") })
                }
                onChangeSparseInput={(e) =>
                  setInputLayer({ ...inputLayer, sparse: e.target.value })
                }
                onChangeRaggedInput={(e) =>
                  setInputLayer({ ...inputLayer, ragged: e.target.value })
                }
                onChangeDTypeInput={(e) =>
                  setInputLayer({ ...inputLayer, dtype: e.target.value })
                }
              />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Hidden Layers</Accordion.Header>
            <Accordion.Body>
              <HiddenLayerParameters
                activation={outputLayer.activation}
                dtype={outputLayer.dtype}
                use_bias={outputLayer.use_bias}
                onChangeActivation={(e) =>
                  setOutputLayer({ ...outputLayer, activation: e.target.value })
                }
                onChangeDType={(e) =>
                  setOutputLayer({ ...outputLayer, dtype: e.target.value })
                }
                onChangeUseBias={(e) =>
                  setOutputLayer({ ...outputLayer, use_bias: e.target.value })
                }
              />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Output Layer</Accordion.Header>
            <Accordion.Body>
              <OutputLayerParameters
                activation_output={outputLayer.activation}
                use_bias_output={outputLayer.use_bias}
                dtype_output={outputLayer.dtype}
                onChangeOutputActivation={(e) =>
                  setOutputLayer({ ...outputLayer, activation: e.target.value })
                }
                onChangeUseBiasOutput={(e) =>
                  setOutputLayer({ ...outputLayer, use_bias: e.target.value })
                }
                onChangeDTypeOutput={(e) =>
                  setOutputLayer({ ...outputLayer, dtype: e.target.value })
                }
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <div className="form-group">
          <input type="submit" value="Pass Model Parameters" className="btn btn-primary mt-3 fw-bold" />
        </div>
      </form>
    </div>
  );
};

export default ModelParameters;