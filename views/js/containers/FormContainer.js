"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var FormContainer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FormContainer, _React$Component);

  function FormContainer(props) {
    var _this;

    _classCallCheck(this, FormContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormContainer).call(this, props));
    _this.state = {
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
    };
    _this.handleInput = _this.handleInput.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handlePosition = _this.handlePosition.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleFormSubmit = _this.handleFormSubmit.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleClearForm = _this.handleClearForm.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleJobs = _this.handleJobs.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleCheckBox = _this.handleCheckBox.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.serverRequest = _this.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.lowercaseFirstLetter = _this.lowercaseFirstLetter.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }
  /* This lifecycle hook gets executed when the component mounts */


  _createClass(FormContainer, [{
    key: "handlePosition",
    value: function handlePosition(e) {
      var newSelection = e.target.value;
      var newSelectionArray;

      if (this.state.newUser.position.indexOf(newSelection) > -1) {
        newSelectionArray = this.state.newUser.position.filter(function (s) {
          return s !== newSelection;
        });
      } else {
        newSelectionArray = _toConsumableArray(this.state.newUser.position).concat([newSelection]);
      }

      this.setState(function (prevState) {
        return {
          newUser: _objectSpread({}, prevState.newUser, {
            position: newSelectionArray
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
          newUser: _objectSpread({}, prevState.newUser, _defineProperty({}, name, value))
        };
      });
    }
  }, {
    key: "handleCheckBox",
    value: function handleCheckBox(e) {
      var newSelection = e.target.value;
      var newSelectionArray;

      if (this.state.newUser.education.indexOf(newSelection) > -1) {
        newSelectionArray = this.state.newUser.education.filter(function (s) {
          return s !== newSelection;
        });
      } else {
        newSelectionArray = _toConsumableArray(this.state.newUser.education).concat([newSelection]);
      }

      this.setState(function (prevState) {
        return {
          newUser: _objectSpread({}, prevState.newUser, {
            education: newSelectionArray
          })
        };
      });
    }
  }, {
    key: "serverRequest",
    value: function serverRequest(userData) {
      var _this2 = this;

      var email = localStorage.getItem("email");

      if (email) {
        this.state.newUser.email = email;
      }

      $.post("../api/v1/users", userData, function (response) {
        _this2.setState({
          user: response
        });

        alert('Application form was submitted');
      }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
      });
    }
  }, {
    key: "handleFormSubmit",
    value: function handleFormSubmit(e) {
      e.preventDefault();
      var userData = this.state.newUser;
      this.serverRequest(userData);
    }
  }, {
    key: "handleClearForm",
    value: function handleClearForm(e) {
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
        }
      });
    }
  }, {
    key: "handleJobs",
    value: function handleJobs(e) {
      e.preventDefault();
      window.location.assign('/jobs');
    }
  }, {
    key: "lowercaseFirstLetter",
    value: function lowercaseFirstLetter(string) {
      return string.charAt(0).toLowerCase() + string.slice(1);
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var idToken = localStorage.getItem("id_token");

      if (idToken) {
        $(this).find(':input[type=primary]').prop('disabled', '');
      } else {
        $(this).find(':input[type=primary]').prop('disabled', 'disabled');
      }
    }
  }, {
    key: "render",
    value: function render() {
      var user = this.props.user;

      if (user !== '' && !this.state.loadedUser) {
        for (var key in user) {
          if (user.hasOwnProperty(key)) {
            var newKey = this.lowercaseFirstLetter(key);
            this.state.newUser[newKey] = user[key];
          }
        }

        this.state.loadedUser = true;
      }

      return React.createElement("form", {
        className: "container-fluid",
        onSubmit: this.handleFormSubmit
      }, React.createElement(Input, {
        inputType: 'text',
        title: 'Full Name',
        name: 'name',
        value: this.state.newUser.name,
        placeholder: 'Enter your name',
        handleChange: this.handleInput
      }), " ", React.createElement(Input, {
        inputType: 'text',
        name: 'phone',
        title: 'Phone number',
        value: this.state.newUser.phone,
        placeholder: 'Enter your phone number',
        handleChange: this.handleInput
      }), " ", React.createElement(CheckBox, {
        title: 'Position(s) you are interested in',
        name: 'position',
        options: this.state.positionOptions,
        selectedOptions: this.state.newUser.position,
        handleChange: this.handlePosition
      }), " ", React.createElement(Input, {
        inputType: 'text',
        title: 'Languages',
        name: 'languages',
        value: this.state.newUser.languages,
        placeholder: 'Comma separated list of any language(s) other than English you are fluent in',
        handleChange: this.handleInput
      }), " ", React.createElement(Input, {
        inputType: 'text',
        title: 'Referrer',
        name: 'referrer',
        value: this.state.newUser.referrer,
        placeholder: 'If you were referred , please enter: Name - Phone',
        handleChange: this.handleInput
      }), " ", React.createElement(CheckBox, {
        title: 'Education',
        name: 'education',
        options: this.state.educationOptions,
        selectedOptions: this.state.newUser.education,
        handleChange: this.handleCheckBox
      }), " ", React.createElement(Input, {
        inputType: 'text',
        title: 'Major/Degree',
        name: 'major',
        value: this.state.newUser.major,
        placeholder: 'Enter your area of study emphasis',
        handleChange: this.handleInput
      }), " ", React.createElement(Input, {
        inputType: 'text',
        title: 'Resume',
        name: 'resume',
        value: this.state.newUser.resume,
        placeholder: 'LinkedIn Profile URL',
        handleChange: this.handleInput
      }), " ", React.createElement(TextArea, {
        title: 'Tells us about yourself',
        rows: 10,
        name: 'about',
        value: this.state.newUser.about,
        placeholder: 'Please write a few sentences explaining your why you are the best candidate for this position(s)',
        handleChange: this.handleInput
      }), React.createElement(TextArea, {
        title: 'Relevant Experience',
        rows: 10,
        name: 'skills',
        value: this.state.newUser.skills,
        placeholder: 'Please describe any work experience you have that has given you the skills to fulfill the requirements of the job(s) for which you are applying',
        handleChange: this.handleInput
      }), React.createElement(Input, {
        inputType: 'text',
        title: 'Professional Reference 1',
        name: 'ref1',
        value: this.state.newUser.ref1,
        placeholder: 'Name - Phone Number - Email',
        handleChange: this.handleInput
      }), " ", React.createElement(Input, {
        inputType: 'text',
        title: 'Professional Reference 2',
        name: 'ref2',
        value: this.state.newUser.ref2,
        placeholder: 'Name - Phone Number - Email',
        handleChange: this.handleInput
      }), " ", React.createElement(Input, {
        inputType: 'text',
        title: 'Personal Reference',
        name: 'ref3',
        value: this.state.newUser.ref3,
        placeholder: 'Name - Phone Number - Email',
        handleChange: this.handleInput
      }), " ", React.createElement("h2", null, "Certification"), React.createElement("p", null, "I certify that the information contained in this application is correct to the best of my knowledge. I understand that to falsify information is grounds for rejection or discharge should I be hired. I authorize any person, organization or company listed on this application to furnish you any and all information concerning my previous employment, education and qualifications for employment. I also authorize you to request and receive such information."), React.createElement("p", null, "In consideration for my employment, I agree to abide by the rules and regulations of the company, which may be changed, withdrawn, added or interpreted at any time, at the company\u2019s sole discretion and without prior notice to me. I also acknowledge that my employment may be terminated, or any offer or acceptance of employment withdrawn, at any time, with or without cause, and with or without prior notice at the discretion of the company or myself."), React.createElement("p", null, "By submitting this application I acknowledge the above statement"), React.createElement(Button, {
        action: this.handleFormSubmit,
        type: 'primary',
        title: 'Submit',
        style: buttonStyle
      }), " ", React.createElement(Button, {
        action: this.handleClearForm,
        type: 'primary',
        title: 'Clear',
        style: buttonStyle
      }), " ", React.createElement(Button, {
        action: this.handleJobs,
        type: 'primary',
        title: 'Go to Jobs',
        style: buttonStyle
      }), " ");
    }
  }]);

  return FormContainer;
}(React.Component);

var buttonStyle = {
  margin: '10px'
};