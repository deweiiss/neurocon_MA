import React, {Component} from "react";

class OutputLayerParameters extends Component {
    render() {
        const {
            activation_output,
            use_bias_output,
            dtype_output,
            onChangeOutputActivation,
            onChangeUseBiasOutput,
            onChangeDTypeOutput
        } = this.props;
        return (
            <div className="form-group">
                <label htmlFor="activationInput">Output Activation Function: </label>
                <select id="activationInput"
                        className="form-select"
                        onChange={onChangeOutputActivation}
                        value={activation_output}>
                    <option value="relu" selected={true}>relu</option>
                    <option value="sigmoid">sigmoid</option>
                    <option value="softmax">softmax</option>
                    <option value="softplus">softplus</option>
                    <option value="softsign">softsign</option>
                    <option value="tanh">tanh</option>
                    <option value="selu">selu</option>
                    <option value="elu">elu</option>
                    <option value="exponential">exponential</option>
                </select>

                <label htmlFor="dataTypeInput">Layer Data Type: </label>
                <select id="dataTypeInput"
                        className="form-select"
                        onChange={onChangeDTypeOutput}
                        value={dtype_output}>
                    <option value="float32" selected={true}>float32</option>
                    <option value="float16">float16</option>
                    <option value="float64">float64</option>
                    <option value="bool">bool</option>
                    <option value="double">double</option>
                    <option value="int16">int16</option>
                    <option value="int32">int32</option>
                    <option value="int64">int64</option>
                    <option value="string">string</option>
                </select>

                <label htmlFor="useBiasInput">Use Bias: </label>
                <select id="useBiasInput"
                        className="form-select"
                        onChange={onChangeUseBiasOutput}
                        value={use_bias_output}>
                    <option value="true" selected={true}>True</option>
                    <option value="false">False</option>
                </select>
            </div>
        )
    }

}

export default OutputLayerParameters;