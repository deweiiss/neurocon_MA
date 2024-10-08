import React, {Component} from "react";

class HiddenLayerParameters extends Component {
    render() {
        const {
            activation,
            dtype,
            use_bias,
            onChangeActivation,
            onChangeDType,
            onChangeUseBias
        } = this.props;
        return (
            <div className="form-group">
                <label htmlFor="activationInput">Activation Function: </label>
                <select id="activationInput"
                        className="form-select"
                        onChange={onChangeActivation}
                        value={activation}>
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
                        onChange={onChangeDType}
                        value={dtype}>
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
                        onChange={onChangeUseBias}
                        value={use_bias}>
                    <option value="true" selected={true}>True</option>
                    <option value="false">False</option>
                </select>
            </div>
        )
    }
}

export default HiddenLayerParameters;