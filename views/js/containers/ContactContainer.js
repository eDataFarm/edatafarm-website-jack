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

var ContactContainer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ContactContainer, _React$Component);

  function ContactContainer(props) {
    var _this;

    _classCallCheck(this, ContactContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContactContainer).call(this, props));
    _this.state = {
      newMessage: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      isVerified: false
    };
    _this.handleInput = _this.handleInput.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleFormSubmit = _this.handleFormSubmit.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleClearForm = _this.handleClearForm.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.serverRequest = _this.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.clearAlerts = _this.clearAlerts.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.setDangerAlert = _this.setDangerAlert.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onLoadRecaptcha = _this.onLoadRecaptcha.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.verifyCallback = _this.verifyCallback.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }
  /* This lifecycle hook gets executed when the component mounts */


  _createClass(ContactContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      loadReCaptcha();

      if (this.captchaDemo) {
        console.log("started, just a second...");
        this.captchaDemo.reset();
      }
    }
  }, {
    key: "onLoadRecaptcha",
    value: function onLoadRecaptcha() {
      if (this.captchaDemo) {
        this.captchaDemo.reset();
      }
    }
  }, {
    key: "verifyCallback",
    value: function verifyCallback(recaptchaToken) {
      // Here you will get the final recaptchaToken!!!
      console.log(recaptchaToken, "<= your recaptcha token");

      if (recaptchaToken) {
        this.setState({
          isVerified: true
        });
      }
    }
  }, {
    key: "handleInput",
    value: function handleInput(e) {
      var value = e.target.value;
      var name = e.target.name;
      this.setState(function (prevState) {
        return {
          newMessage: _objectSpread({}, prevState.newMessage, _defineProperty({}, name, value))
        };
      });
    }
  }, {
    key: "serverRequest",
    value: function serverRequest(userData) {
      var _this2 = this;

      $.post("../api/v1/users", userData, function (response) {
        _this2.setState({
          user: response
        });

        window.location.assign('/user/thanks.html');
      }).fail(function (jqXHR, textStatus, errorThrown) {
        alert('Opps! Something went wrong. Please check your input and try again');
      });
    }
  }, {
    key: "handleFormSubmit",
    value: function handleFormSubmit(e) {
      e.preventDefault();
      var userData = this.state.newMessage;
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
        return;
      }

      this.serverRequest(userData);
    }
  }, {
    key: "handleClearForm",
    value: function handleClearForm(e) {
      e.preventDefault();
      this.clearAlerts();
      this.setState({
        newMessage: {
          name: '',
          email: '',
          subject: '',
          message: ''
        }
      });
    }
  }, {
    key: "clearAlerts",
    value: function clearAlerts() {
      var e = document.getElementById("alert-danger");

      if (e) {
        e.textContent = "Fields with an asterix(*) are required";
      }
    }
  }, {
    key: "setDangerAlert",
    value: function setDangerAlert(string) {
      var e = document.getElementById("alert-danger");
      e.textContent = string;
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this3 = this;

      var email = localStorage.getItem("email");

      if (email) {
        $.get("../api/v1/users/" + email, function (res) {
          if (res.Admin === true) {
            _this3.setState({
              admin: true
            });
          }
        });
        this.state.newMessage.email = email;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return React.createElement("form", {
        className: "container-fluid",
        onSubmit: this.handleFormSubmit
      }, React.createElement("div", {
        className: "alert alert-danger",
        id: "alert-danger"
      }, "Fields with an asterix(*) are required"), React.createElement(Input, {
        inputType: 'text',
        title: 'Your Name*',
        name: 'name',
        value: this.state.newMessage.name,
        placeholder: 'Enter your full name',
        handleChange: this.handleInput
      }), " ", React.createElement(Input, {
        inputType: 'text',
        name: 'email',
        title: 'Your Email*',
        value: this.state.newMessage.email,
        placeholder: 'Enter your email address',
        handleChange: this.handleInput
      }), " ", React.createElement(Input, {
        inputType: 'text',
        title: 'Subject',
        name: 'subject',
        value: this.state.newMessage.subject,
        handleChange: this.handleInput
      }), " ", React.createElement(TextArea, {
        title: 'Message',
        rows: 10,
        name: 'message',
        value: this.state.newMessage.message,
        placeholder: 'Enter your message',
        handleChange: this.handleInput
      }), React.createElement(ReCaptcha, {
        ref: function ref(el) {
          _this4.captchaDemo = el;
        },
        size: "normal",
        "data-theme": "dark",
        render: "explicit",
        sitekey: "6Lc9IY0UAAAAAPJTW6li2-l5ZngZzHmw1ImpqifR",
        onloadCallback: this.onLoadRecaptcha,
        verifyCallback: this.verifyCallback
      }), React.createElement(Button, {
        action: this.handleFormSubmit,
        type: 'primary',
        title: 'Send',
        style: buttonStyle
      }), " ", React.createElement(Button, {
        action: this.handleClearForm,
        type: 'primary',
        title: 'Clear',
        style: buttonStyle
      }), " ");
    }
  }]);

  return ContactContainer;
}(React.Component);

var buttonStyle = {
  margin: '10px'
};