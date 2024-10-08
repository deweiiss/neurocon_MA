import React, {useState} from "react";
import {useCSVReader} from "react-papaparse";
import axios from "axios";

function FileUploadModal({receiveCSVData}) {
    const {CSVReader} = useCSVReader();
    //let data = undefined;
    let component;
    let visible = false;
    const [labelColumn, setLabelColumn] = useState(0);
    const [data, setData] = useState();

    function onSubmit(e) {
        e.preventDefault();
        let modelName = sessionStorage.getItem('modelName');
        let userMail = sessionStorage.getItem('userMail');
        let dict = {
            'modelName': modelName,
            'data': data,
            'labelColumn': labelColumn,
            'userMail': userMail
        }
        console.log(dict);
        axios.post('http://localhost:5000/input/csv', dict)
            .then(res => console.log(res.data))
            .then(() => window.location.hash = "/modelling");
    }

    function onUpdateLabelColumn(e) {
        setLabelColumn(e.target.value);
    }

    component =
        <div className="">
            {visible = true}
            <form>
                <input
                    className="form-control text-center"
                    type="number"
                    required
                    onChange={onUpdateLabelColumn}
                    value={labelColumn}
                />
            </form>
            <button className="btn btn-primary" onClick={onSubmit}>Save Data</button>
        </div>

    // FIXME: we need input for label column in dynamic component!
    /*<form>
        <input className="form-control" type="text" value={labelColumn}
               onChange={e => setLabelColumn(e.target.value)}/>
    </form>*/

    // FIXME: still not centered and looks ugly atm!!!!!
    return (
        <CSVReader onUploadAccepted={(res) =>
            setData(res.data)}>
            {({
                  getRootProps,
                  acceptedFile,
                  ProgressBar,
                  getRemoveFileProps
              }) => (
                <div>
                    <h3 className="mt-3">CSV Upload</h3>
                    <div className="text-center">
                        <button className="btn btn-primary col-2 align-content-center mx-3"
                                type='button' {...getRootProps()}>
                            Browse file
                        </button>

                        <button className="btn btn-danger col-2 align-content-center mx-3" {...getRemoveFileProps()}>
                            Remove
                        </button>

                    </div>
                    <div className="fw-bold col-2 align-content-center ">
                        {acceptedFile && acceptedFile.name}
                    </div>
                    <br/>
                    <div className="col-6 align-content-center">
                        <ProgressBar/>
                        <div className="mb-2 mt-2 align-content-center">
                            Please select Index of column which contains the training labels:
                            {data !== undefined || labelColumn !== 0 || visible !== false ? component : null}
                        </div>
                    </div>

                </div>
            )}
        </CSVReader>
    )
}

export default FileUploadModal;