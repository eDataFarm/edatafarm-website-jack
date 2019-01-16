class Apply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
        };

        this.serverRequest = this.serverRequest.bind(this);
    }

    serverRequest() {
        let email = localStorage.getItem("email");
        $.get("../api/v1/users/" + email, res => {
            if (res.Email !== "") {
                this.setState({
                    user: res,
                });
            }
        });
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
