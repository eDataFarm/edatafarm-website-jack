class NewJobContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newJob: {
                title: '',
                expiresAt: '',
                description: ''
            },
            jobs: []
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
          newJob : {...prevState.newJob, expiresAt: value}
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
          "http://localhost:3000/api/jobs",
          jobData,
              response => {
              // console.log("res... ", response);
              this.setState({ jobs: response });
              this.props.jobs = response;
          });
  }

  handleFormSubmit(e) {
      e.preventDefault();
      let jobData = this.state.newJob;
      this.serverRequest(jobData);
  }

  handleClearForm(e) {
      e.preventDefault();
      this.setState({
          newJob: {
              title: '',
              expiresAt: '',
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
                   name={'expiresAt'}
                   title= {'Expires after'}
                   value={this.state.newJob.expiresAt}
                   placeholder = {'Weeks'}
                   handleChange={this.handleExpiresAt}
            /> {/* Expires after */}

            <TextArea
                title={'Description.'}
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
