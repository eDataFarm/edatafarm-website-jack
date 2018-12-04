class Join extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            countries: [],
            country: '',
            languages: [],
            language: ''
        };

        this.handleCountry = this.handleCountry.bind(this);
        this.handleLanguage = this.handleLanguage.bind(this);
        this.handleClearCountry = this.handleClearCountry.bind(this);
        this.handleClearLanguage = this.handleClearLanguage.bind(this);
        this.serverRequest = this.serverRequest.bind(this);
    }

    serverRequest() {
        if (this.props.country !== undefined) {
            this.state.country = this.props.country;
            this.props.country = undefined;
        }

        let path = "../api/v1/jobs/?country=" + this.state.country + "&language=" + this.state.language;

        $.get(path, res => {
            this.setState({
                jobs: res
            });
        });
    }

    handleCountry(e) {
        this.state.country = e.target.value;
        if (this.loggedIn) {
            this.serverRequest();
            this.render();
        } else {
            window.location.assign('/user');
        }
    }

    handleLanguage(e) {
        this.state.language = e.target.value;
        this.serverRequest();
        this.render();
    }

    handleClearCountry(e) {
        e.preventDefault();
        this.state.country = '';
        this.serverRequest();
        this.render();
    }

    handleClearLanguage(e) {
        e.preventDefault();
        this.state.language = '';
        this.serverRequest();
        this.render();
    }

    componentDidMount() {
        this.serverRequest();
    }

    setup() {
        $.get("../api/v1/countries", res => {
            this.setState({
                countries: res
            });
        });
        $.get("../api/v1/languages", res => {
            this.setState({
                languages: res
            });
        });

        let idToken = localStorage.getItem("id_token");
        if (idToken) {
            this.loggedIn = true;
        } else {
            this.loggedIn = false;
        }
    }

    componentWillMount() {
        this.setup();
    }

    render() {
        if (!this.loggedIn) {
            return (
                <div className="container">
                    <form className="container-fluid">
                        <div className="col-md-6">
                            <Select title={'Select a locale to begin'}
                                    name={'country'}
                                    options = {this.state.countries}
                                    value = {this.state.country}
                                    placeholder={'Select Country'}
                                    style={selectStyle}
                                    handleChange={this.handleCountry}
                            /> {/* Country Filter */}
                        </div>
                    </form>
                </div>
            );
        }
        if (this.state.jobs.length === 0) {
            return (
                <div className="container">
                    <form className="container-fluid">
                        <div className="col-md-6" >
                            <Select title={'Filter By Country'}
                                    name={'country'}
                                    options = {this.state.countries}
                                    value = {this.state.country}
                                    placeholder = {'Select Country'}
                                    style={selectStyle}
                                    handleChange = {this.handleCountry}
                            /> {/* Country Filter */}
                        </div>
                        <div className="col-md-6" >
                            <Select title={'Filter By Language'}
                                    name={'language'}
                                    options = {this.state.languages}
                                    value = {this.state.language}
                                    placeholder = {'Select Language'}
                                    style={selectStyle}
                                    handleChange = {this.handleLanguage}
                            /> {/* Language Filter */}
                        </div>
                    </form>

                    <div className="col-md-offset-3" >
                        <p>Don't see your locale? We still want to hear from you. Please <a href={'../user/index.html'}>click here</a> to apply now</p>
                    </div>
                </div>
            );
        }
        return (
            <div className="container">
                <form className="container-fluid">
                    <div className="col-md-6" >
                        <Select title={'Filter By Country'}
                                name={'country'}
                                options = {this.state.countries}
                                value = {this.state.country}
                                placeholder = {'Select Country'}
                                style={selectStyle}
                                handleChange = {this.handleCountry}
                        /> {/* Country Filter */}
                    </div>
                    <div className="col-md-6" >
                        <Select title={'Filter By Language'}
                                name={'language'}
                                options = {this.state.languages}
                                value = {this.state.language}
                                placeholder = {'Select Language'}
                                style={selectStyle}
                                handleChange = {this.handleLanguage}
                        /> {/* Language Filter */}
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
        if (email) {
            $.post(
                "../api/v1/jobs/apply/" + job.Id,
                {applied: 1, email: email},
                res => {
                    this.setState({applied: "Applied!", jobs: res});
                }
            );
        } else {
            window.location.assign('/user');
        }
    }

    render() {
        return (
            <div className="col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        #{this.props.job.Id}{" "}
                        <span className="pull-right">{this.state.applied}</span>
                    </div>
                    <div className="panel-body">
                        <div><b>{this.props.job.Title}</b></div>
                        <div>{this.props.job.Description}</div>
                        <div><b>Languages:</b> {this.props.job.Languages}</div>
                    </div>
                    <div className="panel-footer">
                        <span className="pull-right">
                            {this.props.job.Applied} Apply &nbsp;
                            <a onClick={this.apply} className="btn btn-default" style={buttonStyle}>
                                <span className="glyphicon glyphicon-pencil" />
                            </a>
                        </span>
                        <div> Expires: {this.props.job.Expiration}</div>
                    </div>
                </div>
            </div>
        )
    }
}

const buttonStyle = {
    marginBottom : '5px'
}

ReactDOM.render(<Join />, document.getElementById('jobs'));
