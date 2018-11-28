class Apply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
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
                if (res.Email !== "") {
                    this.setState({
                        user: res,
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
        return (
            <div className="container">
                <FormContainer user={this.state.user}/>
            </div>
        );
    }
}

ReactDOM.render(<Apply />, document.getElementById('apply'));
