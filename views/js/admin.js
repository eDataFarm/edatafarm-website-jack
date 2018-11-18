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

var Openings =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Openings, _React$Component);

  function Openings(props) {
    var _this;

    _classCallCheck(this, Openings);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Openings).call(this, props));
    _this.state = {
      admin: false
    };
    _this.serverRequest = _this.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Openings, [{
    key: "serverRequest",
    value: function serverRequest() {
      var _this2 = this;

      var email = localStorage.getItem("email");
      $.get("../api/v1/users/" + email, function (res) {
        if (res.Admin === true) {
          _this2.setState({
            admin: true
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
      if (this.state.admin) {
        return React.createElement(JobOpenings, null);
      }

      return React.createElement("div", {
        className: "container"
      }, React.createElement("h3", null, "Admins Only Area. Please log in for access."));
    }
  }]);

  return Openings;
}(React.Component);

var JobOpenings =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(JobOpenings, _React$Component2);

  function JobOpenings(props) {
    var _this3;

    _classCallCheck(this, JobOpenings);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(JobOpenings).call(this, props));
    _this3.state = {
      jobs: []
    };
    _this3.serverRequest = _this3.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    return _this3;
  }

  _createClass(JobOpenings, [{
    key: "serverRequest",
    value: function serverRequest() {
      var _this4 = this;

      $.get("../api/v1/jobs", function (res) {
        _this4.setState({
          jobs: res
        });
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
      if (this.state.jobs.length === 0) {
        return React.createElement("div", {
          className: "container"
        }, React.createElement("a", {
          href: "new.html",
          className: "btn btn-primary btn-lg btn-block pull-right new-job"
        }, React.createElement("span", null, "New Job")), React.createElement("h2", null, "There are no open positions at the moment."), React.createElement("h2", null, "Please add new jobs."));
      }

      return React.createElement("div", {
        className: "container"
      }, React.createElement("a", {
        href: "new.html",
        className: "btn btn-primary btn-lg btn-block pull-right new-job"
      }, React.createElement("span", null, "New Job")), React.createElement("h2", null, "Jobs"), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "container"
      }, this.state.jobs.map(function (job, i) {
        return React.createElement(JobListing, {
          key: i,
          job: job
        });
      }))));
    }
  }]);

  return JobOpenings;
}(React.Component);

var JobListing =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(JobListing, _React$Component3);

  function JobListing(props) {
    var _this5;

    _classCallCheck(this, JobListing);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(JobListing).call(this, props));
    _this5.state = {
      users: [],
      jobs: []
    };
    _this5.applicants = _this5.applicants.bind(_assertThisInitialized(_assertThisInitialized(_this5)));
    _this5.serverRequest = _this5.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this5)));
    return _this5;
  }

  _createClass(JobListing, [{
    key: "applicants",
    value: function applicants() {
      var job = this.props.job;
      this.serverRequest(job);
    }
  }, {
    key: "serverRequest",
    value: function serverRequest(job) {
      var _this6 = this;

      $.post("../api/v1/applicants/" + job.Id, function (res) {
        _this6.setState({
          users: res
        });

        _this6.props.users = res;
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "col-xs-4"
      }, React.createElement("div", {
        className: "panel panel-default"
      }, React.createElement("div", {
        className: "panel-heading"
      }, "#", this.props.job.Id, " "), React.createElement("div", {
        className: "panel-body"
      }, React.createElement("div", null, React.createElement("b", null, this.props.job.Title)), React.createElement("div", null, this.props.job.Description)), React.createElement("div", {
        className: "panel-footer"
      }, React.createElement("div", {
        className: "pull-right"
      }, "Edit \xA0", React.createElement("a", {
        href: "new.html?JobID=" + this.props.job.Id
      }, React.createElement("span", {
        className: "glyphicon glyphicon-pencil"
      }))), React.createElement("div", null, React.createElement("a", {
        href: "users.html?JobID=" + this.props.job.Id
      }, this.props.job.Applicants), "\xA0 Applications"))));
    }
  }]);

  return JobListing;
}(React.Component);

ReactDOM.render(React.createElement(Openings, null), document.getElementById('openings'));