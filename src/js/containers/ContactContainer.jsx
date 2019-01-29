class ContactContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newMessage: {
                name: '',
                email: '',
                subject: '',
                message: '',
            },
            isVerified: false
        }

        this.handleInput = this.handleInput.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.serverRequest = this.serverRequest.bind(this);
        this.clearAlerts = this.clearAlerts.bind(this);
        this.setDangerAlert = this.setDangerAlert.bind(this);
        this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);
    }

    /* This lifecycle hook gets executed when the component mounts */

    componentDidMount() {
        if (this.captchaDemo) {
            console.log("started, just a second...")
            this.captchaDemo.reset();
        }
    }

    onLoadRecaptcha() {
        if (this.captchaDemo) {
            this.captchaDemo.reset();
        }
    }

    verifyCallback(recaptchaToken) {
        // Here you will get the final recaptchaToken!!!
        console.log(recaptchaToken, "<= your recaptcha token")
        if (recaptchaToken) {
            this.setState({
                isVerified: true
            })
        }
    }

    handleInput(e) {
        let value = e.target.value;
        let name = e.target.name;
        this.setState( prevState => ({
          newMessage : {...prevState.newMessage, [name]: value}})
        )
    }

    serverRequest(userData) {
        $.post("../api/v1/users", userData, response => {
            this.setState({ user: response });
            window.location.assign('/user/thanks.html');
        }).fail((jqXHR, textStatus, errorThrown) => {
            alert('Opps! Something went wrong. Please check your input and try again');
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        let userData = this.state.newMessage;

        this.clearAlerts();

        if (!this.state.isVerified) {
            this.setDangerAlert("Please verify that you are a human!");
            return;
        }

        if (userData.name.length < 1) {
            this.setDangerAlert("Please enter your full name");
            return;
        }

        if (userData.email.length < 3 || !/\@/.test(userData.email)) {
            this.setDangerAlert("Enter valid email address");
            return
        }

        this.serverRequest(userData);
    }

    handleClearForm(e) {
        e.preventDefault();
        this.clearAlerts();
        this.setState({
            newMessage: {
                name: '',
                email: '',
                subject: '',
                message: '',
            },
        })
    }

    clearAlerts() {
        var e = document.getElementById("alert-danger");
        if (e) {
            e.textContent = "Fields with an asterix(*) are required";
        }
    }

    setDangerAlert(string) {
        var e = document.getElementById("alert-danger");
        e.textContent = string;
    }

    componentWillMount() {
        let email = localStorage.getItem("email");
        if (email) {
            $.get("../api/v1/users/" + email, res => {
                if (res.Admin === true) {
                    this.setState({
                        admin: true
                    });
                }
            });
            this.state.newMessage.email = email
        }
    }

    render() {
        return (
            <form className="container-fluid" onSubmit={this.handleFormSubmit}>
                {/*<a>Fields with an asterix(*) are required</a>*/}
                {/*<br/>*/}
                <div className="alert alert-danger"
                      id= {"alert-danger"}
                >Fields with an asterix(*) are required</div>
                <Input inputType={'text'}
                       title= {'Your Name*'}
                       name= {'name'}
                       value={this.state.newMessage.name}
                       placeholder = {'Enter your full name'}
                       handleChange = {this.handleInput}
                /> {/* Name of the user */}

                <Input inputType={'text'}
                       name={'email'}
                       title= {'Your Email*'}
                       value={this.state.newMessage.email}
                       placeholder = {'Enter your email address'}
                       handleChange={this.handleInput}
                /> {/* Email address */}

                <Input inputType={'text'}
                       title= {'Subject'}
                       name= {'subject'}
                       value={this.state.newMessage.subject}
                       handleChange = {this.handleInput}
                /> {/* Subject */}

                <TextArea
                    title={'Message'}
                    rows={10}
                    name={'message'}
                    value={this.state.newMessage.message}
                    placeholder={'Enter your message'}
                    handleChange={this.handleInput}
                />{/* Message */}

                {/*<ReCaptcha*/}
                    {/*ref={(el) => {this.captchaDemo = el;}}*/}
                    {/*size="normal"*/}
                    {/*data-theme="dark"*/}
                    {/*render="explicit"*/}
                    {/*sitekey="6Lc9IY0UAAAAAPJTW6li2-l5ZngZzHmw1ImpqifR"*/}
                    {/*onloadCallback={this.onLoadRecaptcha}*/}
                    {/*verifyCallback={this.verifyCallback}*/}
                {/*/>*/}

                <Button
                    action = {this.handleFormSubmit}
                    type = {'primary'}
                    title = {'Send'}
                    style={buttonStyle}
                /> { /* Send */ }

                <Button
                    action = {this.handleClearForm}
                    type = {'primary'}
                    title = {'Clear'}
                    style={buttonStyle}
                /> {/* Clear the form */}

            </form>
        );
    }
}

const buttonStyle = {
    margin : '10px'
}
