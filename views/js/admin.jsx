class Openings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: false
        };

        this.serverRequest = this.serverRequest.bind(this);
    }

    serverRequest() {
        let email = localStorage.getItem("email");
        $.get("http://localhost:3000/api/users/" + email, res => {
            if (res.Admin === true) {
                this.setState({
                    admin: true
                });
            }
        });
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
        $.get("http://localhost:3000/api/jobs", res => {
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
                    <h2>There are no open positions at the moment. Please add new jobs.</h2>
                </div>
            );
        }
        return (
            <div className="container">
                <a href="admin/new.html" className="btn btn-primary btn-lg btn-block pull-right new-job"><span>New Job</span></a>
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
            "http://localhost:3000/api/applicants/" + job.Id,
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
                        {this.props.job.Applicants} Applications &nbsp;
                        <a onClick={this.applicants} className="btn btn-default">
                            <span className="glyphicon glyphicon-user" />
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Openings />, document.getElementById('openings'));
