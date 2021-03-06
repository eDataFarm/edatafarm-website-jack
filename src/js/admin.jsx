class Openings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: false
        };

        this.serverRequest = this.serverRequest.bind(this);
    }

    authenticate() {
        this.WebAuth = new auth0.WebAuth({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID,
            scope: "openid profile",
            audience: AUTH0_API_AUDIENCE,
            responseType: "token id_token",
            redirectUri: AUTH0_CALLBACK_URL
        });
        this.WebAuth.authorize();
    }

    serverRequest() {
        let email = localStorage.getItem("email");
        if (email) {
            $.get("../api/v1/users/" + email, res => {
                if (res.Admin === true) {
                    this.setState({
                        admin: true
                    });
                }
            });
        } else {
            this.authenticate();
        }
    }

    componentDidMount() {
        this.serverRequest();
    }


    render() {
        if (this.state.admin) {
            return <JobOpenings />;
        }
        return (
            <div className="container">
                <h3>Admins Only Area. Please log in for access.</h3>
            </div>
        );
    }
}

class JobOpenings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: []
        };

        this.serverRequest = this.serverRequest.bind(this);
    }

    serverRequest() {
        $.get("../api/v1/jobs", res => {
            this.setState({
                jobs: res
            });
        });
    }

    componentDidMount() {
        this.serverRequest();
    }

    render() {
        if (this.state.jobs.length === 0) {
            return (
                <div className="container">
                    <a href="new.html" className="btn btn-primary btn-lg btn-block pull-right new-job"><span>New Job</span></a>
                    <h2>There are no open positions at the moment.</h2>
                    <h2>Please add new jobs.</h2>
                </div>
            );
        }
        return (
            <div className="container">
                <a href="new.html" className="btn btn-primary btn-lg btn-block pull-right new-job"><span>New Job</span></a>
                <h2>Jobs</h2>
                <div className="row">
                    <div className="container">
                        {this.state.jobs.map(function(job, i) {
                            return <JobListing key={i} job={job} />;
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

class JobListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            jobs: []
        };
        this.applicants = this.applicants.bind(this);
        this.serverRequest = this.serverRequest.bind(this);
    }

    applicants() {
        let job = this.props.job;
        this.serverRequest(job);
    }

    serverRequest(job) {
        $.post(
            "../api/v1/applicants/" + job.Id,
            res => {
                this.setState({users: res });
                this.props.users = res;
            }
        );
    }

    render() {
        return (
            <div className="col-xs-4">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        #{this.props.job.Id}{" "}
                    </div>
                    <div className="panel-body">
                        <div><b>{this.props.job.Title}</b></div>
                        <div>{this.props.job.Description}</div>
                    </div>
                    <div className="panel-footer">
                        <div className="pull-right">
                            Edit &nbsp;
                            <a href={"new.html?JobID=" + this.props.job.Id} className="btn btn-default" style={buttonStyle}>
                                <span className="glyphicon glyphicon-pencil" />
                            </a>
                        </div>
                        <div>
                            <a href={"users.html?JobID=" + this.props.job.Id} >
                                {this.props.job.Applicants}
                            </a>
                            &nbsp; Applications
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const buttonStyle = {
    marginBottom : '5px'
}

ReactDOM.render(<Openings />, document.getElementById('openings'));
