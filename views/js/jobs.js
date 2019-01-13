"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var Join =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Join, _React$Component);

  function Join(props) {
    var _this;

    _classCallCheck(this, Join);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Join).call(this, props));
    _this.state = {
      jobs: [],
      countries: [],
      country: '',
      languages: [],
      language: ''
    };
    _this.handleCountry = _this.handleCountry.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleLanguage = _this.handleLanguage.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleClearCountry = _this.handleClearCountry.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleClearLanguage = _this.handleClearLanguage.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.serverRequest = _this.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Join, [{
    key: "serverRequest",
    value: function serverRequest() {
      var _this2 = this;

      if (this.props.country !== undefined) {
        this.state.country = this.props.country;
        this.props.country = undefined;
      }

      var path = "../api/v1/jobs/?country=" + this.state.country + "&language=" + this.state.language;
      $.get(path, function (res) {
        _this2.setState({
          jobs: res
        });
      });
    }
  }, {
    key: "handleCountry",
    value: function handleCountry(e) {
      this.state.country = e.target.value;

      if (this.loggedIn) {
        this.serverRequest();
        this.render();
      } else {
        window.location.assign('/user');
      }
    }
  }, {
    key: "handleLanguage",
    value: function handleLanguage(e) {
      this.state.language = e.target.value;
      this.serverRequest();
      this.render();
    }
  }, {
    key: "handleClearCountry",
    value: function handleClearCountry(e) {
      e.preventDefault();
      this.state.country = '';
      this.serverRequest();
      this.render();
    }
  }, {
    key: "handleClearLanguage",
    value: function handleClearLanguage(e) {
      e.preventDefault();
      this.state.language = '';
      this.serverRequest();
      this.render();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.serverRequest();
    }
  }, {
    key: "setup",
    value: function setup() {
      var _this3 = this;

      $.get("../api/v1/countries", function (res) {
        _this3.setState({
          countries: res
        });
      });
      $.get("../api/v1/languages", function (res) {
        _this3.setState({
          languages: res
        });
      });
      var idToken = localStorage.getItem("id_token");

      if (idToken) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.setup();
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.loggedIn) {
        return React.createElement("div", {
          className: "container"
        }, React.createElement("form", {
          className: "container-fluid"
        }, React.createElement("div", {
          className: "col-md-6"
        }, React.createElement(Select, {
          name: 'country',
          options: this.state.countries,
          value: this.state.country,
          placeholder: 'Select Country',
          style: selectStyle,
          handleChange: this.handleCountry
        }), " ")));
      }

      if (this.state.jobs.length === 0) {
        return React.createElement("div", {
          className: "container"
        }, React.createElement("form", {
          className: "container-fluid"
        }, React.createElement("div", {
          className: "col-md-6"
        }, React.createElement(Select, {
          title: 'Filter By Country',
          name: 'country',
          options: this.state.countries,
          value: this.state.country,
          placeholder: 'Select Country',
          style: selectStyle,
          handleChange: this.handleCountry
        }), " "), React.createElement("div", {
          className: "col-md-6"
        }, React.createElement(Select, {
          title: 'Filter By Language',
          name: 'language',
          options: this.state.languages,
          value: this.state.language,
          placeholder: 'Select Language',
          style: selectStyle,
          handleChange: this.handleLanguage
        }), " ")), React.createElement("div", {
          className: "col-md-offset-3"
        }, React.createElement("p", null, "Don't see your locale? We still want to hear from you. Please ", React.createElement("a", {
          href: '../user/index.html'
        }, "click here"), " to apply now")));
      }

      return React.createElement("div", {
        className: "container"
      }, React.createElement("form", {
        className: "container-fluid"
      }, React.createElement("div", {
        className: "col-md-6"
      }, React.createElement(Select, {
        title: 'Filter By Country',
        name: 'country',
        options: this.state.countries,
        value: this.state.country,
        placeholder: 'Select Country',
        style: selectStyle,
        handleChange: this.handleCountry
      }), " "), React.createElement("div", {
        className: "col-md-6"
      }, React.createElement(Select, {
        title: 'Filter By Language',
        name: 'language',
        options: this.state.languages,
        value: this.state.language,
        placeholder: 'Select Language',
        style: selectStyle,
        handleChange: this.handleLanguage
      }), " ")), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "container"
      }, this.state.jobs.map(function (job, i) {
        return React.createElement(Job, {
          key: i,
          job: job
        });
      }))));
    }
  }]);

  return Join;
}(React.Component);

var selectStyle = {
  backgroundRepeat: "no-repeat !important",
  width: '1200px'
};

var Job =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Job, _React$Component2);

  function Job(props) {
    var _this4;

    _classCallCheck(this, Job);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Job).call(this, props));
    _this4.state = {
      applied: "",
      jobs: []
    };
    _this4.apply = _this4.apply.bind(_assertThisInitialized(_assertThisInitialized(_this4)));
    _this4.serverRequest = _this4.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this4)));
    return _this4;
  }

  _createClass(Job, [{
    key: "apply",
    value: function apply() {
      var job = this.props.job;
      this.serverRequest(job);
    }
  }, {
    key: "serverRequest",
    value: function serverRequest(job) {
      var _this5 = this;

      var email = localStorage.getItem("email");

      if (email) {
        $.post("../api/v1/jobs/apply/" + job.Id, {
          applied: 1,
          email: email
        }, function (res) {
          _this5.setState({
            applied: "Applied!",
            jobs: res
          });
        });
      } else {
        window.location.assign('/user');
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "col-md-6"
      }, React.createElement("div", {
        className: "panel panel-default"
      }, React.createElement("div", {
        className: "panel-heading"
      }, "#", this.props.job.Id, " ", React.createElement("span", {
        className: "pull-right"
      }, this.state.applied)), React.createElement("div", {
        className: "panel-body"
      }, React.createElement("div", null, React.createElement("b", null, this.props.job.Title)), React.createElement("div", null, this.props.job.Description), React.createElement("div", null, React.createElement("b", null, "Languages:"), " ", this.props.job.Languages)), React.createElement("div", {
        className: "panel-footer"
      }, React.createElement("span", {
        className: "pull-right"
      }, this.props.job.Applied, " Apply \xA0", React.createElement("a", {
        onClick: this.apply,
        className: "btn btn-default",
        style: buttonStyle
      }, React.createElement("span", {
        className: "glyphicon glyphicon-pencil"
      }))), React.createElement("div", null, " Expires: ", this.props.job.Expiration))));
    }
  }]);

  return Job;
}(React.Component);

var buttonStyle = {
  marginBottom: '5px'
};
ReactDOM.render(React.createElement(Join, null), document.getElementById('jobs'));