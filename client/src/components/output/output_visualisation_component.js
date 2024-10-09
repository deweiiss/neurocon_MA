import React, {Component} from "react";
import axios from "axios";
import Chart from "react-apexcharts";

class OutputGraphs extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            userMail: sessionStorage.getItem('userMail'),
            modelName: sessionStorage.getItem('modelName'),
            modelId: sessionStorage.getItem('modelId'),
            metrics: {},
            series: [{
                name: '',
                data: []
            }],
            options: {
                chart: {
                    id: 'chart'
                },
                toolbar: {
                    show: false
                },
                xaxis: {
                    categories: [],
                },
                legend: {
                    show: false
                }
            }
        }
    }

    componentDidMount() {
        console.log(this.state.modelName);

        axios.get('http://localhost:5003/output/graphs', {
            params: {
                userMail: this.state.userMail,
                modelName: this.state.modelName,
            }
        }).then((res) => {
            this.setState({
                metrics: res.data['metrics'],
                iterations: res.data['iterations'],
                options: {
                    chart: {
                        id: 'chart'
                    },
                    toolbar: {
                        show: false
                    },
                    xaxis: {
                        categories: this.cleanIterations(res.data['iterations'])
                    },
                    legend: {
                        show: false
                    }
                }
            })

        })
    }

    chartList(key, value) {
        // do only use it with reasonable amount of iterations
        // console.log(value)
        let x = 0;
        let valuesNew = value;
        while (x < valuesNew.length) {
            valuesNew[x] = Number.parseFloat(valuesNew[x]).toFixed(2);
            x++
        }
        let series = [{
            name: key,
            data: valuesNew
        }]
        return <div>
            <h4 className="h4 fw-bold mx-3">{key.replace('_', ' ')}</h4>
            <Chart series={series} options={this.state.options} type="line" width={800}
                   height={300}/>
        </div>
    }

    // TODO: check if we can find a better way of doing this!
    cleanIterations(iterations) {
        let iterationsNew = iterations;
        for (let i = 0; i < iterationsNew.length; i++) {
            if (iterationsNew.length <= 100) {
                if ((iterationsNew[i] % 10) !== 0 || iterationsNew[i] < 10) {
                    iterationsNew[i] = '';
                }
            } else if (iterationsNew.length <= 1000) {
                if ((iterationsNew[i] % 100) !== 0 || iterationsNew[i] < 100) {
                    iterationsNew[i] = '';
                }
            } else if (iterationsNew.length <= 10000) {
                if ((iterationsNew[i] % 500) !== 0 || iterationsNew[i] < 500) {
                    iterationsNew[i] = '';
                }
            } else if (iterationsNew.length > 10000) {
                if ((iterationsNew[i] % 1000) !== 0 || iterationsNew[i] < 1000) {
                    iterationsNew[i] = '';
                }
            }
        }
        return iterationsNew;
    }

    onBackClick() {
        window.location.hash = "/dashboard";
    }

    // TODO: sending all information needed to report service and then receiving the final report ready to download!
    async onSubmit() {
        console.log(this.state);
        axios.post('http://localhost:5004/report/create', this.state)
            .then((res) => {
                console.log(res.data)
            })
        // TODO: add a download functionality to this after the report was created!!!
    }

    render() {
        let chartList = [];
        for (const [key, value] of Object.entries(this.state.metrics)) {
            chartList.push(this.chartList(key, value))
        }
        return (
            <div>
                <div>
                    <button className="btn btn-secondary m-3" onClick={this.onBackClick}>
                        Back
                    </button>
                    <button className="btn btn-primary float-end m-3" onClick={this.onSubmit}>
                        Create Report
                    </button>
                </div>
                <div className="mx-3" id="charts">
                    {chartList}
                </div>
            </div>
        )
    }

}

export default OutputGraphs;