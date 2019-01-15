class FormContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newUser: {
                name: '',
                email: '',
                phone: '',
                position: [],
                languages: '',
                referrer: '',
                filename: '',
                resume: '',
                education: [],
                major: '',
                reference: '',
            },
            selectedFile: null,
            loaded: 0,
            positionOptions: ['Transcriber', 'Project Manager', 'Data Analyst Engineer'],
            educationOptions: ['Associates', 'Bachelors', 'Masters', 'Doctorate', 'Other'],
            users: [],
            loadedUser: false
        }

        this.handleInput = this.handleInput.bind(this);
        this.handlePosition = this.handlePosition.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.handleSelectedFile = this.handleSelectedFile.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.serverRequest = this.serverRequest.bind(this);
        this.lowercaseFirstLetter = this.lowercaseFirstLetter.bind(this);
        this.clearAlerts = this.clearAlerts.bind(this);
        this.setDangerAlert = this.setDangerAlert.bind(this);
    }

    /* This lifecycle hook gets executed when the component mounts */

    handlePosition(e) {
        const newSelection = e.target.value;
        let newSelectionArray;

        if(this.state.newUser.position.indexOf(newSelection) > -1) {
            newSelectionArray = this.state.newUser.position.filter(s => s !== newSelection)
        } else {
            newSelectionArray = [...this.state.newUser.position, newSelection];
        }

        this.setState( prevState => ({
                newUser:
                    {...prevState.newUser, position: newSelectionArray }
            })
        )
    }

    handleInput(e) {
        let value = e.target.value;
        let name = e.target.name;
        this.setState( prevState => ({
          newUser : {...prevState.newUser, [name]: value}})
        )
    }

    handleCheckBox(e) {
        const newSelection = e.target.value;
        let newSelectionArray;

        if(this.state.newUser.education.indexOf(newSelection) > -1) {
            newSelectionArray = this.state.newUser.education.filter(s => s !== newSelection)
        } else {
            newSelectionArray = [...this.state.newUser.education, newSelection];
        }

        this.setState( prevState => ({
              newUser:
                  {...prevState.newUser, education: newSelectionArray }
        })
        )
    }

    handleSelectedFile(e) {
        let file = e.target.files[0];

        if (file) {
            this.setState(prevState => ({
                    selectedFile: file,
                    loaded: 0,
                    newUser:
                        {...prevState.newUser, filename: file.name}
                })
            )
        }
    }

    downloadLink() {
        if (this.state.newUser.filename) {
            return  <a href={"../user/resumes/" + this.state.newUser.filename}>Download link</a>
        }
    }

    handleUpload(e) {
        e.preventDefault();
        const data = new FormData();
        data.append('file', this.state.selectedFile, this.state.selectedFile.name);

        axios.post("../api/v1/upload", data, progressEvent => {
            this.setState({
                loaded: (progressEvent.loaded / progressEvent.total*100),
            })
        }).then(res => {
            alert("File Upload ok", res.statusText)
        });
    }

    serverRequest(userData) {
        let email = localStorage.getItem("email");
        if (email) {
            this.state.newUser.email = email
        }

        $.post("../api/v1/users", userData, response => {
            this.setState({ user: response });
            alert('Application form was submitted');
            window.location.assign('/user/thanks.html');
        }).fail((jqXHR, textStatus, errorThrown) => {
            alert('Opps! Something went wrong. Please check your input and try again');
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        let userData = this.state.newUser;

        this.clearAlerts();

        if (userData.name.length < 1) {
            this.setDangerAlert("Please enter your full name");
            return;
        }

        if (userData.phone.length < 10) {
            this.setDangerAlert("Phone number must have at least 10 digits.");
            return;
        }

        if (userData.position.length < 1) {
            this.setDangerAlert("Please select the position(s) you are interested in");
            return;
        }

        if (userData.languages.length < 1) {
            this.setDangerAlert("Please enter any language(s) you are fluent in");
            return;
        }

        if (userData.filename.length < 1) {
            this.setDangerAlert("Please upload your resume file");
            return;
        }

        if (userData.reference.length < 1) {
            this.setDangerAlert("Please enter your reference information");
            return;
        }

        this.serverRequest(userData);
    }

    handleClearForm(e) {
        e.preventDefault();
        this.clearAlerts();
        this.setState({
            newUser: {
                name: '',
                email: '',
                phone: '',
                position: [],
                languages: '',
                referrer: '',
                filename: '',
                resume: '',
                loaded: 0,
                education: [],
                major: '',
                reference: ''
            },
        })
    }

    lowercaseFirstLetter(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
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
        let idToken = localStorage.getItem("id_token");
        if (idToken) {
            $(this).find(':input[type=primary]').prop('disabled', '');
        } else {
            $(this).find(':input[type=primary]').prop('disabled', 'disabled');
        }
    }

    render() {
        let user = this.props.user;
        if (user !== '' && !this.state.loadedUser) {
            for (var key in user) {
                if (user.hasOwnProperty(key)) {
                    let newKey = this.lowercaseFirstLetter(key);
                    this.state.newUser[newKey] = user[key];
                }
            }
            this.state.loadedUser = true;
        }

        return (
            <form className="container-fluid" onSubmit={this.handleFormSubmit}>
                {/*<a>Fields with an asterix(*) are required</a>*/}
                {/*<br/>*/}
                <div className="alert alert-danger"
                      id= {"alert-danger"}
                >Fields with an asterix(*) are required</div>
                <Input inputType={'text'}
                       title= {'Full Name*'}
                       name= {'name'}
                       value={this.state.newUser.name}
                       placeholder = {'Enter your name'}
                       handleChange = {this.handleInput}
                /> {/* Name of the user */}

                <Input inputType={'text'}
                       name={'phone'}
                       title= {'Phone number*'}
                       value={this.state.newUser.phone}
                       placeholder = {'Enter your phone number'}
                       handleChange={this.handleInput}
                /> {/* Phone number */}

                <CheckBox  title={'Position(s) you are interested in*'}
                           name={'position'}
                           options={this.state.positionOptions}
                           selectedOptions = { this.state.newUser.position}
                           handleChange={this.handlePosition}
                /> {/* Position */}

                <Input inputType={'text'}
                       title= {'Languages*'}
                       name= {'languages'}
                       value={this.state.newUser.languages}
                       placeholder = {'Comma separated list of any language(s) you are fluent in'}
                       handleChange = {this.handleInput}
                /> {/* Languages */}

                <Input inputType={'text'}
                       title= {'Referrer'}
                       name= {'referrer'}
                       value={this.state.newUser.referrer}
                       placeholder = {'If you were referred , please enter: Name - Phone'}
                       handleChange = {this.handleInput}
                /> {/* Referrer */}

                <CheckBox  title={'Education'}
                      name={'education'}
                      options={this.state.educationOptions}
                      selectedOptions = { this.state.newUser.education}
                      handleChange={this.handleCheckBox}
                /> {/* Education */}

                <Input inputType={'text'}
                       title= {'Major/Degree'}
                       name= {'major'}
                       value={this.state.newUser.major}
                       placeholder = {'Enter your area of study emphasis'}
                       handleChange = {this.handleInput}
                /> {/* Major/Degree */}

                <Input inputType={'file'}
                       title= {'Upload Resume/CV'}
                       name= {'resume'}
                       handleChange={this.handleSelectedFile}
                /> {/* Resume */}

                <Button
                    action = {this.handleUpload}
                    type = {'primary'}
                    title = {'Upload'}
                    style={buttonStyle}
                /> { /* Upload */ }
                {/*{Math.round(this.state.loaded,2) } %*/}
                {this.downloadLink()}

                <TextArea
                    title={'Resume/CV*'}
                    rows={10}
                    name={'resume'}
                    value={this.state.newUser.resume}
                    placeholder={'Paste resume or linked profile URL'}
                    handleChange={this.handleInput}
                />{/* Paste resume or linked profile URL */}

                <Input inputType={'text'}
                       title= {'Professional and/or personal reference*'}
                       name= {'reference'}
                       value={this.state.newUser.reference}
                       placeholder = {'Name - Phone Number - Email'}
                       handleChange = {this.handleInput}
                /> {/* Reference */}

                <h2>Certification</h2>
                <p>
                    I certify that the information contained in this application is correct to the best of my knowledge.
                    I understand that to falsify information is grounds for rejection or discharge should I be hired.
                    I authorize any person, organization or company listed on this application to furnish you any and all information
                    concerning my previous employment, education and qualifications for employment. I also authorize
                    you to request and receive such information.
                </p>
                <p>
                    In consideration for my employment, I agree to abide by the rules and regulations of the company,
                    which may be changed, withdrawn, added or interpreted at any time, at the company’s sole discretion
                    and without prior notice to me. I also acknowledge that my employment may be terminated, or any
                    offer or acceptance of employment withdrawn, at any time, with or without cause, and with or without
                    prior notice at the discretion of the company or myself.
                </p>

                <p>By submitting this application I acknowledge the above statement</p>

                <Button
                    action = {this.handleFormSubmit}
                    type = {'primary'}
                    title = {'Submit'}
                    style={buttonStyle}
                /> { /* Submit */ }

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
