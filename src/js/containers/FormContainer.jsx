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
                resume: '',
                education: [],
                major: '',
                about: '',
                skills: '',
                ref1: '',
                ref2: '',
                ref3: ''
            },
            positionOptions: ['Transcriber', 'Project Manager', 'Data Analyst Engineer'],
            educationOptions: ['G.E.D.', 'Associates', 'Bachelors', 'Masters', 'Doctorate', 'Other'],
            users: [],
            loadedUser: false
        }

        this.handleInput = this.handleInput.bind(this);
        this.handlePosition = this.handlePosition.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.serverRequest = this.serverRequest.bind(this);
        this.lowercaseFirstLetter = this.lowercaseFirstLetter.bind(this);
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

    serverRequest(userData) {
        let email = localStorage.getItem("email");
        if (email) {
            this.state.newUser.email = email
        }

        $.post("../api/v1/users", userData, response => {
            this.setState({ user: response });
            alert('Application form was submitted');
        }).fail((jqXHR, textStatus, errorThrown) => {
            alert(textStatus + ': ' + errorThrown);
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        let userData = this.state.newUser;
        this.serverRequest(userData);
    }

    handleClearForm(e) {
        e.preventDefault();
        this.setState({
            newUser: {
                name: '',
                email: '',
                phone: '',
                position: [],
                languages: '',
                referrer: '',
                resume: '',
                education: [],
                major: '',
                about: '',
                skills: '',
                ref1: '',
                ref2: '',
                ref3: ''
            },
        })
    }

    lowercaseFirstLetter(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
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

                <Input inputType={'text'}
                       title= {'Full Name'}
                       name= {'name'}
                       value={this.state.newUser.name}
                       placeholder = {'Enter your name'}
                       handleChange = {this.handleInput}
                /> {/* Name of the user */}

                <Input inputType={'text'}
                       name={'phone'}
                       title= {'Phone number'}
                       value={this.state.newUser.phone}
                       placeholder = {'Enter your phone number'}
                       handleChange={this.handleInput}
                /> {/* Phone number */}

                <CheckBox  title={'Position(s) you are interested in'}
                           name={'position'}
                           options={this.state.positionOptions}
                           selectedOptions = { this.state.newUser.position}
                           handleChange={this.handlePosition}
                /> {/* Position */}

                <Input inputType={'text'}
                       title= {'Languages'}
                       name= {'languages'}
                       value={this.state.newUser.languages}
                       placeholder = {'Comma separated list of any language(s) other than English you are fluent in'}
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

                <Input inputType={'text'}
                       title= {'Resume'}
                       name= {'resume'}
                       value={this.state.newUser.resume}
                       placeholder = {'LinkedIn Profile URL'}
                       handleChange = {this.handleInput}
                /> {/* Resume */}

                <TextArea
                    title={'Tells us about yourself'}
                    rows={10}
                    name={'about'}
                    value={this.state.newUser.about}
                    placeholder={'Please write a few sentences explaining your why you are the best candidate for this position(s)'}
                    handleChange={this.handleInput}
                />{/* About you */}

                <TextArea
                    title={'Relevant Experience'}
                    rows={10}
                    name={'skills'}
                    value={this.state.newUser.skills}
                    placeholder={'Please describe any work experience you have that has given you the skills to fulfill the requirements of the job(s) for which you are applying'}
                    handleChange={this.handleInput}
                />{/* Skills */}

                <Input inputType={'text'}
                       title= {'Professional Reference 1'}
                       name= {'ref1'}
                       value={this.state.newUser.ref1}
                       placeholder = {'Name - Phone Number - Email'}
                       handleChange = {this.handleInput}
                /> {/* Professional Reference */}

                <Input inputType={'text'}
                       title= {'Professional Reference 2'}
                       name= {'ref2'}
                       value={this.state.newUser.ref2}
                       placeholder = {'Name - Phone Number - Email'}
                       handleChange = {this.handleInput}
                /> {/* Professional Reference */}

                <Input inputType={'text'}
                       title= {'Personal Reference'}
                       name= {'ref3'}
                       value={this.state.newUser.ref3}
                       placeholder = {'Name - Phone Number - Email'}
                       handleChange = {this.handleInput}
                /> {/* Personal Reference */}

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
                /> { /*Submit */ }

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
