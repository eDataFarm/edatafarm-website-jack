class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: false
        };

        this.serverRequest = this.serverRequest.bind(this);
    }

    serverRequest() {
        let email = localStorage.getItem("email");
        $.get("http://localhost:3000/api/v1/users/" + email, res => {
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
            return <Applicants />;
        }
        return (
            <div className="container">
                <h3>Admins Only Area. Please log in for access.</h3>
            </div>
        );
    }
}

class Applicants extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };

        this.serverRequest = this.serverRequest.bind(this);
    }

    serverRequest() {
        let jobID;
        if ( location.search.match(/JobID=([^&]*)/i) )
        {
            jobID = location.search.match(/JobID=([^&]*)/i)[1];
        }

        $.get("http://localhost:3000/api/v1/applicants/" + jobID, res => {
            this.setState({
                users: res
            });
        });
    }

    componentDidMount() {
        this.serverRequest();
    }

    render() {
        if (this.state.users.length === 0) {
            return (
                <div className="container">
                    <h2>There are no applicants for this position at the moment.</h2>
                </div>
            );
        }
        return (
            <div className="container">
                <h2>Users</h2>
                <div className="row">
                    <div className="container">
                        {this.state.users.map(function(user, i) {
                            return <User key={i} user={user} />;
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

class User extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col-xs-4">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        #{this.props.user.Id}{" "}
                    </div>
                    <div className="panel-body">
                        <div><b>{this.props.user.Name}</b></div>
                        <div>{this.props.user.About}</div>
                    </div>
                    <div className="panel-footer">
                        <div className="pull-right">
                            <a href={"mailto:" + this.props.user.Email} >
                                Email
                            </a>
                        </div>
                        <div>
                            <a href={"../user.html?Id=" + this.props.user.Id} >
                                Profile
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Users />, document.getElementById('users'));
