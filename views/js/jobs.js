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
      user: false
    };
    _this.serverRequest = _this.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Join, [{
    key: "serverRequest",
    value: function serverRequest() {
      var _this2 = this;

      var email = localStorage.getItem("email");
      $.get("../api/v1/users/" + email, function (res) {
        if (res.Email !== "") {
          _this2.setState({
            user: true
          });
        }
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.serverRequest();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(Jobs, null);
    }
  }]);

  return Join;
}(React.Component);

var Jobs =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Jobs, _React$Component2);

  function Jobs(props) {
    var _this3;

    _classCallCheck(this, Jobs);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Jobs).call(this, props));
    _this3.state = {
      jobs: [],
      countries: [],
      country: '',
      languages: [],
      language: ''
    };
    _this3.handleCountry = _this3.handleCountry.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    _this3.handleLanguage = _this3.handleLanguage.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    _this3.handleClearCountry = _this3.handleClearCountry.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    _this3.handleClearLanguage = _this3.handleClearLanguage.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    _this3.serverRequest = _this3.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    return _this3;
  }

  _createClass(Jobs, [{
    key: "serverRequest",
    value: function serverRequest() {
      var _this4 = this;

      var path = "../api/v1/jobs/?country=" + this.state.country + "&language=" + this.state.language;
      $.get(path, function (res) {
        _this4.setState({
          jobs: res
        });
      });
    }
  }, {
    key: "handleCountry",
    value: function handleCountry(e) {
      this.state.country = e.target.value;
      this.serverRequest();
      this.render();
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
      var _this5 = this;

      $.get("../api/v1/countries", function (res) {
        _this5.setState({
          countries: res
        });
      });
      $.get("../api/v1/languages", function (res) {
        _this5.setState({
          languages: res
        });
      });
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.setup();
    }
  }, {
    key: "render",
    value: function render() {
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
        }), " ")), React.createElement("p", null, "There are no matching positions at the moment. Please clear any filters or check again later."), React.createElement("div", {
          className: "container"
        }, React.createElement("a", {
          className: "x-btn btn_style_rec x-btn-global",
          href: "../../user/index.html",
          "data-options": "thumbnail: ''",
          style: applyStyle
        }, "Apply Now")));
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

  return Jobs;
}(React.Component);

var selectStyle = {
  backgroundRepeat: "no-repeat !important",
  width: '1200px'
};
var applyStyle = {
  outline: 'none'
};

var Job =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(Job, _React$Component3);

  function Job(props) {
    var _this6;

    _classCallCheck(this, Job);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Job).call(this, props));
    _this6.state = {
      applied: "",
      jobs: []
    };
    _this6.apply = _this6.apply.bind(_assertThisInitialized(_assertThisInitialized(_this6)));
    _this6.serverRequest = _this6.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this6)));
    return _this6;
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
      var _this7 = this;

      var email = localStorage.getItem("email");
      $.post("../api/v1/jobs/apply/" + job.Id, {
        applied: 1,
        email: email
      }, function (res) {
        _this7.setState({
          applied: "Applied!",
          jobs: res
        });
      });
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
      }, React.createElement("div", null, React.createElement("b", null, this.props.job.Title)), React.createElement("div", null, this.props.job.Description), React.createElement("div", null, React.createElement("b", null, "Languages:"), this.props.job.Languages)), React.createElement("div", {
        className: "panel-footer"
      }, this.props.job.Applied, " Apply \xA0", React.createElement("a", {
        onClick: this.apply,
        className: "btn btn-default"
      }, React.createElement("span", {
        className: "glyphicon glyphicon-pencil"
      })))));
    }
  }]);

  return Job;
}(React.Component);

ReactDOM.render(React.createElement(Join, null), document.getElementById('jobs'));