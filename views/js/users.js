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

var Users =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Users, _React$Component);

  function Users(props) {
    var _this;

    _classCallCheck(this, Users);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Users).call(this, props));
    _this.state = {
      admin: false
    };
    _this.serverRequest = _this.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Users, [{
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
        return React.createElement(Applicants, null);
      }

      return React.createElement("div", {
        className: "container"
      }, React.createElement("h3", null, "Admins Only Area. Please log in for access."));
    }
  }]);

  return Users;
}(React.Component);

var Applicants =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Applicants, _React$Component2);

  function Applicants(props) {
    var _this3;

    _classCallCheck(this, Applicants);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Applicants).call(this, props));
    _this3.state = {
      users: []
    };
    _this3.serverRequest = _this3.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    return _this3;
  }

  _createClass(Applicants, [{
    key: "serverRequest",
    value: function serverRequest() {
      var _this4 = this;

      var jobID;

      if (location.search.match(/JobID=([^&]*)/i)) {
        jobID = location.search.match(/JobID=([^&]*)/i)[1];
      }

      $.get("../api/v1/applicants/" + jobID, function (res) {
        _this4.setState({
          users: res
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
      if (this.state.users.length === 0) {
        return React.createElement("div", {
          className: "container"
        }, React.createElement("h2", null, "There are no applicants for this position at the moment."));
      }

      return React.createElement("div", {
        className: "container"
      }, React.createElement("h2", null, "Users"), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "container"
      }, this.state.users.map(function (user, i) {
        return React.createElement(User, {
          key: i,
          user: user
        });
      }))));
    }
  }]);

  return Applicants;
}(React.Component);

var User =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(User, _React$Component3);

  function User(props) {
    _classCallCheck(this, User);

    return _possibleConstructorReturn(this, _getPrototypeOf(User).call(this, props));
  }

  _createClass(User, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "col-md-6"
      }, React.createElement("div", {
        className: "panel panel-default"
      }, React.createElement("div", {
        className: "panel-heading"
      }, "#", this.props.user.Id, " "), React.createElement("div", {
        className: "panel-body"
      }, React.createElement("div", null, React.createElement("b", null, this.props.user.Name)), React.createElement("div", null, this.props.user.Resume), React.createElement("div", null, React.createElement("a", {
        href: "../user/resumes/" + this.props.user.Filename
      }, "Resume"))), React.createElement("div", {
        className: "panel-footer"
      }, React.createElement("div", {
        className: "pull-right"
      }, React.createElement("a", {
        href: "mailto:" + this.props.user.Email
      }, "Email")), React.createElement("div", null, React.createElement("a", {
        href: "user.html?email=" + this.props.user.Email
      }, "Profile")))));
    }
  }]);

  return User;
}(React.Component);

ReactDOM.render(React.createElement(Users, null), document.getElementById('users'));