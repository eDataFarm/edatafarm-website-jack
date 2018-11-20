class Join extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: false
        };

        this.serverRequest = this.serverRequest.bind(this);
    }

    serverRequest() {
        let email = localStorage.getItem("email");
        $.get("../api/v1/users/" + email, res => {
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
        return <Jobs />;
    }
}

class Jobs extends React.Component {
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
        let path = "../api/v1/jobs/?country=" + this.state.country + "&language=" + this.state.language;

        $.get(path, res => {
            this.setState({
                jobs: res
            });
        });
    }

    handleCountry(e) {
        this.state.country = e.target.value;
        this.serverRequest();
        this.render();
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
    }

    componentWillMount() {
        this.setup();
    }

    render() {
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

                    <p>There are no matching positions at the moment. Please clear any filters or check again later.</p>

                    <div className="container">
                        <a className={"x-btn btn_style_rec x-btn-global"}
                           href={"../../user/index.html"}
                           data-options={"thumbnail: ''"}
                           style={applyStyle}>
                            Apply Now
                        </a>
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

const applyStyle = {
    outline: 'none',
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
            "../api/v1/jobs/apply/" + job.Id,
            { applied: 1 , email: email},
            res => {
                this.setState({ applied: "Applied!", jobs: res });
            }
        );
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

ReactDOM.render(<Join />, document.getElementById('jobs'));
