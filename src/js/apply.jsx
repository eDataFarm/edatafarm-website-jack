class Apply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            loggedIn: false
        };

        this.serverRequest = this.serverRequest.bind(this);
    }

    serverRequest() {
        let email = localStorage.getItem("email");
        if (email) {
            this.setState({loggedIn: true });
            $.get("../api/v1/users/" + email, res => {
                if (res.Email !== "") {
                    this.setState({
                        user: res,
                    });
                }
            });
        }
    }

    componentDidMount() {
        this.serverRequest();
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <div className="container">
                    <FormContainer user={this.state.user}/>
                </div>
            );
        }
        return (
            <h2>Please sign up above to fill out an application.</h2>
        )
    }
}

ReactDOM.render(<Apply />, document.getElementById('apply'));
