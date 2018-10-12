class FormContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newUser: {
                name: '',
                email: '',
                age: '',
                gender: '',
                resume: '',
                education: [],
                about: ''
            },
            genderOptions: ['Male', 'Female', 'Others'],
            educationOptions: ['G.E.D', 'Bachelors', 'Masters', 'Other'],
            users: []
        }

        this.handleTextArea = this.handleTextArea.bind(this);
        this.handleAge = this.handleAge.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleResume = this.handleResume.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.serverRequest = this.serverRequest.bind(this);
  }

  /* This lifecycle hook gets executed when the component mounts */

  handleAge(e) {
      let value = e.target.value;
      this.setState( prevState => ({
          newUser : {...prevState.newUser, age: value}})
      )
  }

  handleResume(e) {
      let value = e.target.value;
      this.setState( prevState => ({
          newUser : {...prevState.newUser, resume: value}})
      )
  }

  handleInput(e) {
      let value = e.target.value;
      let name = e.target.name;
      this.setState( prevState => ({
          newUser : {...prevState.newUser, [name]: value}})
      )
  }

  handleTextArea(e) {
      let value = e.target.value;
      this.setState(prevState => ({
          newUser: {...prevState.newUser, about: value}})
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
      $.post(
          "http://localhost:3000/api/v1/users",
          userData,
              response => {
              // console.log("res... ", response);
              this.setState({ users: response });
              this.props.users = response;
          });
  }

  handleFormSubmit(e) {
      e.preventDefault();
      let email = localStorage.getItem("email");
      if (email) {
          this.state.newUser.email = email
      }
      let userData = this.state.newUser;

      this.serverRequest(userData);
  }

  handleClearForm(e) {
      e.preventDefault();
      this.setState({
          newUser: {
              name: '',
              email: '',
              age: '',
              gender: '',
              resume: '',
              education: [],
              about: ''
          },
      })
  }

  render() {
    return (

        <form className="container-fluid" onSubmit={this.handleFormSubmit}>

            <Input inputType={'text'}
                   title= {'Full Name'}
                   name= {'name'}
                   value={this.state.newUser.name}
                   placeholder = {'Enter your name'}
                   handleChange = {this.handleInput}
            /> {/* Name of the user */}

            <Input inputType={'number'}
                   name={'age'}
                   title= {'Age'}
                   value={this.state.newUser.age}
                   placeholder = {'Enter your age'}
                   handleChange={this.handleAge}
            /> {/* Age */}

            <Select title={'Gender'}
                  name={'gender'}
                  options = {this.state.genderOptions}
                  value = {this.state.newUser.gender}
                  placeholder = {'Select Gender'}
                  handleChange = {this.handleInput}
            /> {/* Age Selection */}

            <CheckBox  title={'Education'}
                  name={'education'}
                  options={this.state.educationOptions}
                  selectedOptions = { this.state.newUser.education}
                  handleChange={this.handleCheckBox}
            /> {/* Skill */}

            <Input inputType={'text'}
                   title= {'Resume'}
                   name= {'resume'}
                   value={this.state.newUser.resume}
                   placeholder = {'LinkedIn Profile URL'}
                   handleChange = {this.handleInput}
            /> {/* Resume */}

            <TextArea
                title={'Tells us about yourself.'}
                rows={10}
                name={'about'}
                value={this.state.newUser.about}
                placeholder={'Describe your past experience and skills'}
                handleChange={this.handleTextArea}
            />{/* About you */}

            <Button
                action = {this.handleFormSubmit}
                type = {'primary'}
                title = {'Submit'}
                style={buttonStyle}
            /> { /*Submit */ }

            <Button
                action = {this.handleClearForm}
                type = {'secondary'}
                title = {'Clear'}
                style={buttonStyle}
            /> {/* Clear the form */}
        </form>
    );
  }
}

const buttonStyle = {
  margin : '10px 10px 10px 10px'
}
