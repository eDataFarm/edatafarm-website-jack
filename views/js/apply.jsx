class Apply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: false
        };

        this.serverRequest = this.serverRequest.bind(this);
    }

    serverRequest() {
        let email = localStorage.getItem("email");
        $.get("http://localhost:3000/api/v1/users/" + email, res => {
            if (res.Email !== "") {
                this.setState({
                    user: true
                });
            }
        });
    }

    componentDidMount() {
        this.serverRequest();
    }


    render() {
        if (this.state.user) {
            return <Jobs />;
        }
        return (
            <div className="container">
                <FormContainer />
            </div>
        );
    }
}

class Jobs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            countries: [],
            country: ''
        };

        this.handleLanguage = this.handleLanguage.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.serverRequest = this.serverRequest.bind(this);
    }

    serverRequest() {
        let path = "http://localhost:3000/api/v1/jobs/";
        if (this.state.country !== '') {
            path = "http://localhost:3000/api/v1/filteredJobs/"+ this.state.country;
        }

        $.get(path, res => {
            this.setState({
                jobs: res
            });
        });
        $.get("http://localhost:3000/api/v1/countries", res => {
            this.setState({
                countries: res
            });
        });
    }

    handleLanguage(e) {
        this.state.country = e.target.value;
        this.serverRequest();
        this.render();
    }

    handleClearForm(e) {
        e.preventDefault();
        this.state.country = '';
        this.serverRequest();
        this.render();
    }

    componentDidMount() {
        this.serverRequest();
    }

    render() {
        if (this.state.jobs.length === 0) {
            return (
                <div className="container">
                    <h2>Jobs</h2>

                    <form className="container-fluid">
                        <div className="col-md-6" >
                            <Select title={'Filter By Country'}
                                    name={'country'}
                                    options = {this.state.countries}
                                    value = {this.state.country}
                                    placeholder = {'Select Country'}
                                    style={selectStyle}
                                    handleChange = {this.handleLanguage}
                            /> {/* Country Filter */}
                        </div>
                        <div className="col-md-6">
                            <Button
                                action = {this.handleClearForm}
                                type = {'primary'}
                                title = {'Clear Filters'}
                                style={buttonStyle}
                            /> {/* Clear the form */}
                        </div>
                    </form>
                    <h2>There are no matching positions at the moment. Please clear any filters or check again later.</h2>
                </div>
            );
        }
        return (
            <div className="container">
                <h2>Jobs</h2>
                <form className="container-fluid">
                    <div className="col-md-6" >
                        <Select title={'Filter By Country'}
                                name={'country'}
                                options = {this.state.countries}
                                value = {this.state.country}
                                placeholder = {'Select Country'}
                                style = {selectStyle}
                                handleChange = {this.handleLanguage}
                        /> {/* Country Filter */}
                    </div>
                    <div className="col-md-6">
                        <Button
                            action = {this.handleClearForm}
                            type = {'primary'}
                            title = {'Clear Filters'}
                            style={buttonStyle}
                        /> {/* Clear the form */}
                    </div>
                </form>

                <div className="row">
                    <div className="container">
                        {this.state.jobs.map(function(job, i) {
                            return <Job key={i} job={job} />;
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

const buttonStyle = {
    margin : '32px'
}

const selectStyle = {
    backgroundRepeat: "no-repeat !important",
    width: '1200px'
}

class Job extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            applied: "",
            jobs: []
        };
        this.apply = this.apply.bind(this);
        this.serverRequest = this.serverRequest.bind(this);
    }

    apply() {
        let job = this.props.job;
        this.serverRequest(job);
    }

    serverRequest(job) {
        let email = localStorage.getItem("email");
        $.post(
            "http://localhost:3000/api/v1/jobs/apply/" + job.Id,
            { applied: 1 , email: email},
            res => {
                this.setState({ applied: "Applied!", jobs: res });
            }
        );
    }

    render() {
        return (
            <div className="col-xs-4">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        #{this.props.job.Id}{" "}
                        <span className="pull-right">{this.state.applied}</span>
                    </div>
                    <div className="panel-body">
                        <div><b>{this.props.job.Title}</b></div>
                        <div>{this.props.job.Description}</div>
                    </div>
                    <div className="panel-footer">
                        {this.props.job.Applied} Apply &nbsp;
                        <a onClick={this.apply} className="btn btn-default">
                            <span className="glyphicon glyphicon-pencil" />
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Apply />, document.getElementById('apply'));
