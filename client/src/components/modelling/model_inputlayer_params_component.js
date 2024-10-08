import React, {Component} from "react";

class InputLayerParameters extends Component {
    render() {
        const {
            batch_input_shape,
            sparse_input,
            ragged_input,
            dtype_input,
            onChangeBatchInputShape,
            onChangeSparseInput,
            onChangeRaggedInput,
            onChangeDTypeInput
        } = this.props;
        return (
            <div className="form-group">

                <label htmlFor="batchInputShape">Batch Input Shape:</label>
                <input id="batchInputShape"
                       type="text"
                       required
                       className="form-control"
                       onChange={onChangeBatchInputShape}
                       value={batch_input_shape}
                       placeholder={"e.g. [150, 4]"}
                />

                <label htmlFor="sparse">Sparse:</label>
                <input id="sparse"
                       type="text"
                       required
                       className="form-control"
                       onChange={onChangeSparseInput}
                       value={sparse_input}
                />

                <label htmlFor="ragged">Ragged:</label>
                <input id="ragged"
                       type="text"
                       required
                       className="form-control"
                       onChange={onChangeRaggedInput}
                       value={ragged_input}
                />

                <label htmlFor="dtype">Layer Data Type:</label>
                <select id="dtype"
                        className="form-select"
                        onChange={onChangeDTypeInput}
                        value={dtype_input}>
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

            </div>
        )
    }
}

export default InputLayerParameters;