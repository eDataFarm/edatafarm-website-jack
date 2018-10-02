const AUTH0_CLIENT_ID = "kNXPBJIHPZnzOTgG3h1wOydoGF0Tjto3";
const AUTH0_DOMAIN = "edatafarm.auth0.com";
const AUTH0_CALLBACK_URL = location.href;
const AUTH0_API_AUDIENCE = "http://www.edatafarm.com";

class App extends React.Component {
    parseHash() {
        this.auth0 = new auth0.WebAuth({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID
        });
        this.auth0.parseHash(window.location.hash, (err, authResult) => {
            if (err) {
                return console.log(err);
            }
            if (
                authResult !== null &&
                authResult.accessToken !== null &&
                authResult.idToken !== null
            ) {
                localStorage.setItem("access_token", authResult.accessToken);
                localStorage.setItem("id_token", authResult.idToken);
                localStorage.setItem(
                    "profile",
                    JSON.stringify(authResult.idTokenPayload)
                );
                window.location = window.location.href.substr(
                    0,
                    window.location.href.indexOf("#")
                );
            }
        });
    }

    setup() {
        $.ajaxSetup({
            beforeSend: (r) => {
                if (localStorage.getItem("access_token")) {
                    r.setRequestHeader(
                        "Authorization",
                        "Bearer " + localStorage.getItem("access_token")
                    );
                }
            }
        });
    }

    setState() {
        let idToken = localStorage.getItem("id_token");
        if (idToken) {
            this.loggedIn = true;
        } else {
            this.loggedIn = false;
        }
    }

    componentWillMount() {
        this.setup();
        this.parseHash();
        this.setState();
    }

    render() {
        if (this.loggedIn) {
            return <LoggedIn />;
        }
        return <Home />;
    }
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.authenticate = this.authenticate.bind(this);
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

    render() {
        return (
            <a onClick={this.authenticate} className="btn btn-primary btn-lg btn-login btn-block">
                <span>Sign Up <i className="la la-arrow-right"></i></span>
            </a>
        );
    }
}

class LoggedIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };

        this.serverRequest = this.serverRequest.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("profile");
        location.reload();
    }

    serverRequest() {
        $.get("http://localhost:3000/api/users", res => {
            this.setState({
                users: res
            });
        });
    }

    componentDidMount() {
        this.serverRequest();
    }

    render() {
        return (
            <a onClick={this.logout}>Log out</a>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
