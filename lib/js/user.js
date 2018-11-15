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

var User =
/*#__PURE__*/
function (_React$Component) {
  _inherits(User, _React$Component);

  function User(props) {
    var _this;

    _classCallCheck(this, User);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(User).call(this, props));
    _this.state = {
      admin: false,
      user: ""
    };
    _this.serverRequest = _this.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(User, [{
    key: "serverRequest",
    value: function serverRequest() {
      var _this2 = this;

      var adminEmail = localStorage.getItem("email");
      $.get("http://localhost:3000/api/v1/users/" + adminEmail, function (res) {
        if (res.Admin === true) {
          _this2.setState({
            admin: true
          });
        }
      });
      var userEmail;

      if (location.search.match(/email=([^&]*)/i)) {
        userEmail = location.search.match(/email=([^&]*)/i)[1];
      }

      $.get("http://localhost:3000/api/v1/users/" + userEmail, function (res) {
        _this2.setState({
          user: res
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
      if (this.state.admin) {
        if (this.state.user !== "") {
          return React.createElement("div", {
            className: "container"
          }, React.createElement(FormContainer, {
            user: this.state.user
          }));
        } else {
          return React.createElement("div", {
            className: "container"
          }, React.createElement("h3", null, "User with that email was not found in the DB"));
        }
      }

      return React.createElement("div", {
        className: "container"
      }, React.createElement("h3", null, "Admins Only Area. Please log in for access."));
    }
  }]);

  return User;
}(React.Component);

ReactDOM.render(React.createElement(User, null), document.getElementById('user'));