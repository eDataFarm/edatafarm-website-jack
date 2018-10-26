class NewJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: false,
            job: ""
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

        let jobID;
        if ( location.search.match(/JobID=([^&]*)/i) )
        {
            jobID = location.search.match(/JobID=([^&]*)/i)[1];
        }

        $.get("http://localhost:3000/api/v1/jobs/" + jobID, res => {
            this.setState({
                job: res
            });
        });
    }

    componentDidMount() {
        this.serverRequest();
    }

    render() {
        if (this.state.admin) {
            return (
                <div className="col-md-6">
                    <NewJobContainer job={this.state.job}/>
                </div>
            );
        }
        return (
            <div className="container">
                <h3>Admins Only Area. Please log in for access.</h3>
            </div>
        );
    }
}

ReactDOM.render(<NewJob />, document.getElementById('newJob'));
