import React, {Component} from "react";
import axios from "axios";

class DBQueryModal extends Component {

    constructor(props) {
        super(props);

        this.onChangeDbType = this.onChangeDbType.bind(this);
        this.onChangeHost = this.onChangeHost.bind(this);
        this.onChangeDatabase = this.onChangeDatabase.bind(this);
        this.onChangeUser = this.onChangeUser.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePort = this.onChangePort.bind(this);
        this.onChangeQuery = this.onChangeQuery.bind(this);

        this.state = {
            userMail: sessionStorage.getItem('userMail'),
            modelName: sessionStorage.getItem('modelName'),
            dbType: 'postgres',
            host: 'localhost',
            database: '',
            user: '',
            password: '',
            port: 5432,
            query: '',
        }
    }

    onChangeDbType(e) {
        this.setState({
            dbType: e.target.value
        })
    }

    onChangeHost(e) {
        this.setState({
            host: e.target.value
        })
    }

    onChangeDatabase(e) {
        this.setState({
            database: e.target.value
        })
    }

    onChangeUser(e) {
        this.setState({
            user: e.target.value
        })
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    onChangePort(e) {
        this.setState({
            port: e.target.value
        })
    }

    onChangeQuery(e) {
        this.setState({
            query: e.target.value
        })
    }

    resetForm() {
        this.setState({
            userMail: '',
            modelName: '',
            dbType: '',
            host: '',
            database: '',
            user: '',
            password: '',
            port: '',
            query: '',
        })
    };

    async onSubmit(e) {
        e.preventDefault();
        axios.post('http://localhost:5000/input/querydb', this.state)
            .then((res) => {
                console.log(res.data)
            })
            .then(() => {
                this.resetForm()
            });
    }

    // todo: do it with floating labels!!! looks much nicer than currently
    render() {
        return (
            <div>
                <div className="contact mt-4">
                    <h3>Query Database</h3>
                </div>
                <div className="container-contact">
                    <form method="POST" onSubmit={this.onSubmit.bind(this)}>
                        <div className="form-group col-8 d-inline-flex">
                            <label htmlFor="dbTypeInput">Database Type: </label>
                            <select className="form-select" id="dbTypeInput" value={this.state.dbType}
                                    onChange={this.onChangeDbType}>
                                <option value="postgres">Postgres</option>
                                <option value="mysql">MySQL</option>
                                <option value="mariadb">MariaDB</option>
                                <option value="oracle">Oracle</option>
                            </select>

                            <label htmlFor="hostInput">Host: </label>
                            <input id="hostInput"
                                   type="text"
                                   placeholder={"localhost"}
                                   required
                                   className="form-control"
                                   onChange={this.onChangeHost}
                                   value={this.state.host}
                            />
                        </div>

                        <div className="form-group col-8 d-inline-flex">
                            <label htmlFor="databaseInput">Database Name: </label>
                            <input id="databaseInput"
                                   type="text"
                                   required
                                   className="form-control"
                                   onChange={this.onChangeDatabase}
                                   value={this.state.database}
                            />

                            <label htmlFor="userInput">Database User: </label>
                            <input id="userInput"
                                   type="text"
                                   required
                                   className="form-control"
                                   onChange={this.onChangeUser}
                                   value={this.state.user}
                            />
                        </div>

                        <div className="form-group col-8 d-inline-flex">
                            <label htmlFor="passwordInput">Database Password: </label>
                            <input id="passwordInput"
                                   type="password"
                                   required
                                   className="form-control"
                                   onChange={this.onChangePassword}
                                   value={this.state.password}
                            />

                            <label htmlFor="portInput">Database Port: </label>
                            <input id="portInput"
                                   type="text"
                                   required
                                   className="form-control"
                                   onChange={this.onChangePort}
                                   value={this.state.port}
                            />
                        </div>

                        <div className="form-group col-3">
                            <label htmlFor="queryInput">Query: </label>
                            <input id="queryInput"
                                   type="text"
                                   required
                                   className="form-control"
                                   onChange={this.onChangeQuery}
                                   value={this.state.query}
                                   placeholder={"SELECT * FROM your_database;"}
                            />
                        </div>

                        <div className="form-group mb-5">
                            <input type="submit" value="Pass Params" className="btn btn-primary"/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}


export default DBQueryModal;