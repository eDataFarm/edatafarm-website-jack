"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var NewJobContainer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(NewJobContainer, _React$Component);

  function NewJobContainer(props) {
    var _this;

    _classCallCheck(this, NewJobContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NewJobContainer).call(this, props));
    _this.state = {
      newJob: {
        title: '',
        expiration: '',
        description: '',
        country: '',
        languages: ''
      },
      countries: [],
      loadedJobs: false
    };
    _this.handleTitle = _this.handleTitle.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleLanguages = _this.handleLanguages.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleInput = _this.handleInput.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleExpiresAt = _this.handleExpiresAt.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleDescription = _this.handleDescription.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleFormSubmit = _this.handleFormSubmit.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleClearForm = _this.handleClearForm.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.serverRequest = _this.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.lowercaseFirstLetter = _this.lowercaseFirstLetter.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }
  /* This lifecycle hook gets executed when the component mounts */


  _createClass(NewJobContainer, [{
    key: "handleTitle",
    value: function handleTitle(e) {
      var value = e.target.value;
      this.setState(function (prevState) {
        return {
          newJob: _objectSpread({}, prevState.newJob, {
            title: value
          })
        };
      });
    }
  }, {
    key: "handleLanguages",
    value: function handleLanguages(e) {
      var value = e.target.value;
      this.setState(function (prevState) {
        return {
          newJob: _objectSpread({}, prevState.newJob, {
            languages: value
          })
        };
      });
    }
  }, {
    key: "handleExpiresAt",
    value: function handleExpiresAt(e) {
      var value = e.target.value;
      this.setState(function (prevState) {
        return {
          newJob: _objectSpread({}, prevState.newJob, {
            expiration: value
          })
        };
      });
    }
  }, {
    key: "handleDescription",
    value: function handleDescription(e) {
      var value = e.target.value;
      this.setState(function (prevState) {
        return {
          newJob: _objectSpread({}, prevState.newJob, {
            description: value
          })
        };
      });
    }
  }, {
    key: "handleInput",
    value: function handleInput(e) {
      var value = e.target.value;
      var name = e.target.name;
      this.setState(function (prevState) {
        return {
          newJob: _objectSpread({}, prevState.newJob, _defineProperty({}, name, value))
        };
      });
    }
  }, {
    key: "serverRequest",
    value: function serverRequest(jobData) {
      $.post("http://localhost:3000/api/v1/jobs", jobData, function (response) {
        alert('Job was submitted');
        window.location.assign('/admin');
      }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
      });
    }
  }, {
    key: "handleFormSubmit",
    value: function handleFormSubmit(e) {
      e.preventDefault();
      var jobData = this.state.newJob;
      this.serverRequest(jobData);
    }
  }, {
    key: "handleClearForm",
    value: function handleClearForm(e) {
      e.preventDefault();
      this.setState({
        newJob: {
          title: '',
          expiration: '',
          description: '',
          country: '',
          languages: ''
        }
      });
    }
  }, {
    key: "lowercaseFirstLetter",
    value: function lowercaseFirstLetter(string) {
      return string.charAt(0).toLowerCase() + string.slice(1);
    }
  }, {
    key: "render",
    value: function render() {
      var job = this.props.job;

      if (job["Countries"] !== undefined) {
        this.state.countries = job["Countries"];
        delete job["Countries"];
      }

      if (!this.state.loadedJobs) {
        for (var key in job) {
          if (job.hasOwnProperty(key)) {
            var newKey = this.lowercaseFirstLetter(key);
            this.state.newJob[newKey] = job[key];
          }
        }

        this.state.newJob.expiration = 1;
        this.state.loadedJobs = true;
      }

      return React.createElement("form", {
        className: "container-fluid",
        onSubmit: this.handleFormSubmit
      }, React.createElement(Input, {
        inputType: 'text',
        title: 'Job Title',
        name: 'title',
        value: this.state.newJob.title,
        placeholder: 'Enter job title',
        handleChange: this.handleTitle
      }), " ", React.createElement(Input, {
        inputType: 'number',
        name: 'expiration',
        title: 'Expires after',
        value: this.state.newJob.expiration,
        placeholder: 'Weeks',
        handleChange: this.handleExpiresAt
      }), " ", React.createElement(TextArea, {
        title: 'Description',
        rows: 10,
        name: 'description',
        value: this.state.newJob.description,
        placeholder: 'Describe the position',
        handleChange: this.handleDescription
      }), React.createElement(Select, {
        title: 'Country',
        name: 'country',
        options: this.state.countries,
        value: this.state.newJob.country,
        placeholder: 'Select Country',
        handleChange: this.handleInput
      }), " ", React.createElement(Input, {
        inputType: 'text',
        title: 'Languages',
        name: 'languages',
        value: this.state.newJob.languages,
        placeholder: 'Comma separated list of any language(s) required',
        handleChange: this.handleLanguages
      }), " ", React.createElement(Button, {
        action: this.handleFormSubmit,
        type: 'primary',
        title: 'Submit',
        style: buttonStyle
      }), " ", React.createElement(Button, {
        action: this.handleClearForm,
        type: 'primary',
        title: 'Clear',
        style: buttonStyle
      }), " ");
    }
  }]);

  return NewJobContainer;
}(React.Component);

var buttonStyle = {
  margin: '10px'
};