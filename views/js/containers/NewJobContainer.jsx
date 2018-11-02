class NewJobContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newJob: {
                title: '',
                expiration: '',
                description: '',
                country: '',
                languages: []
            },
            countries: [],
            redirectToReferrer: false
        }

        this.handleTitle = this.handleTitle.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleExpiresAt = this.handleExpiresAt.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.serverRequest = this.serverRequest.bind(this);
        this.lowercaseFirstLetter = this.lowercaseFirstLetter.bind(this);
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

    handleInput(e) {
        let value = e.target.value;
        let name = e.target.name;
        this.setState( prevState => ({
            newUser : {...prevState.newUser, [name]: value}})
        )
    }

    serverRequest(jobData) {
        $.post("http://localhost:3000/api/v1/jobs", jobData, response => {});
    }

    handleFormSubmit(e) {
        e.preventDefault();
        let jobData = this.state.newJob;
        this.serverRequest(jobData);
        this.setState({redirectToReferrer: true})
        alert('Job was submitted');
        event.preventDefault();
    }

    handleClearForm(e) {
        e.preventDefault();
        this.setState({
            newJob: {
                title: '',
                expiration: '',
                description: '',
                country: '',
                languages: []
            }
        })
    }

    lowercaseFirstLetter(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }

    render() {
      let job = this.props.job;
      if (job !== undefined) {
          if (job["Countries"] !== undefined) {
              this.state.countries = job["Countries"].split("\n");
              delete job["Countries"];
          }

          for (var key in job) {
              if (job.hasOwnProperty(key)) {
                  let newKey = this.lowercaseFirstLetter(key);
                  this.state.newJob[newKey] = job[key];
              }
          }
          this.state.newJob.expiration = 1;
          this.props.jobs = undefined;
      }

      const redirectToReferrer = this.state.redirectToReferrer;
      if (redirectToReferrer === true) {
          //return <<Redirect to="/admin" />
      }

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
                  value={this.state.newJob.description}
                  placeholder={'Describe the position'}
                  handleChange={this.handleDescription}
              />{/* Job description */}

              <Select title={'Country'}
                      name={'country'}
                      options = {this.state.countries}
                      value = {this.state.newJob.country}
                      placeholder = {'Select Country'}
                      handleChange = {this.handleInput}
              /> {/* Country Selection */}

              <Input inputType={'text'}
                     title= {'Languages'}
                     name= {'languages'}
                     value={this.state.newJob.languages}
                     placeholder = {'Comma separated list of any language(s) other than English you are fluent in'}
                     handleChange = {this.handleInput}
              /> {/* Languages */}

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
  margin : '10px'
}
