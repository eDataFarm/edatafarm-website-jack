class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: false,
            user: ""
        };

        this.serverRequest = this.serverRequest.bind(this);
    }

    serverRequest() {
        let adminEmail = localStorage.getItem("email");
        $.get("http://localhost:3000/api/v1/users/" + adminEmail, res => {
            if (res.Admin === true) {
                this.setState({
                    admin: true
                });
            }
        });

        let userEmail;
        if ( location.search.match(/email=([^&]*)/i) )
        {
            userEmail = location.search.match(/email=([^&]*)/i)[1];
        }

        $.get("http://localhost:3000/api/v1/users/" + userEmail, res => {
            this.setState({
                user: res
            });
        });
    }

    componentDidMount() {
        this.serverRequest();
    }

    render() {
        if (this.state.admin) {
            if (this.state.user !== "") {
                return (
                    <div className="col-md-6">
                        <FormContainer user={this.state.user}/>
                    </div>
                );
            } else {
                return (
                    <div className="container">
                        <h3>User with that email was not found in the DB</h3>
                    </div>
                );
            }
        }
        return (
            <div className="container">
                <h3>Admins Only Area. Please log in for access.</h3>
            </div>
        );
    }
}

ReactDOM.render(<User />, document.getElementById('user'));
