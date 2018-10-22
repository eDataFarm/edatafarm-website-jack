class NewJobContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newJob: {
                title: '',
                expiration: '',
                description: ''
            },
            requestSuccessful: false
        }

        this.handleTitle = this.handleTitle.bind(this);
        this.handleExpiresAt = this.handleExpiresAt.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.serverRequest = this.serverRequest.bind(this);
  }

  /* This lifecycle hook gets executed when the component mounts */

  handleTitle(e) {
      let value = e.target.value;
      this.setState( prevState => ({
          newJob : {...prevState.newJob, title: value}
      })
      )
  }

  handleExpiresAt(e) {
      let value = e.target.value;
      this.setState( prevState => ({
          newJob : {...prevState.newJob, expiration: value}
      })
      )
  }

  handleDescription(e) {
      let value = e.target.value;
      this.setState(prevState => ({
          newJob: {...prevState.newJob, description: value}
      })
      )
  }

  serverRequest(jobData) {
      $.post(
          "http://localhost:3000/api/v1/jobs", jobData,
          response => {
              // console.log("res... ", response);
              if (response !== "") {
                  this.setState({ requestSuccessful: true });
            }
          });
  }

  handleFormSubmit(e) {
      e.preventDefault();
      let jobData = this.state.newJob;
      this.serverRequest(jobData);
      // console.log("Bool", this.state.requestSuccessful);
      // if(this.state.requestSuccessful){
      //     this.props.history.push('/admin')
      // }
      return <NewJob />
  }

  handleClearForm(e) {
      e.preventDefault();
      this.setState({
          newJob: {
              title: '',
              expiration: '',
              description: ''
          },
      })
  }

  render() {
    return (

        <form className="container-fluid" onSubmit={this.handleFormSubmit}>

            <Input inputType={'text'}
                   title= {'Job Title'}
                   name= {'title'}
                   value={this.state.newJob.title}
                   placeholder = {'Enter job title'}
                   handleChange = {this.handleTitle}
            /> {/* Title of the job */}

            <Input inputType={'number'}
                   name={'expiration'}
                   title= {'Expires after'}
                   value={this.state.newJob.expiration}
                   placeholder = {'Weeks'}
                   handleChange={this.handleExpiresAt}
            /> {/* Expires after */}

            <TextArea
                title={'Description'}
                rows={10}
                name={'description'}
                value={this.state.newJob.about}
                placeholder={'Describe the position'}
                handleChange={this.handleDescription}
                />{/* Job description */}

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
