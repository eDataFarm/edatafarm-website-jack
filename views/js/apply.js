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

var Apply =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Apply, _React$Component);

  function Apply(props) {
    var _this;

    _classCallCheck(this, Apply);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Apply).call(this, props));
    _this.state = {
      user: ''
    };
    _this.serverRequest = _this.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Apply, [{
    key: "authenticate",
    value: function authenticate() {
      this.WebAuth = new auth0.WebAuth({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID,
        scope: "openid profile",
        audience: AUTH0_API_AUDIENCE,
        responseType: "token id_token",
        redirectUri: AUTH0_CALLBACK_URL
      });
      this.WebAuth.authorize();
    }
  }, {
    key: "serverRequest",
    value: function serverRequest() {
      var _this2 = this;

      var email = localStorage.getItem("email");

      if (email) {
        $.get("../api/v1/users/" + email, function (res) {
          if (res.Email !== "") {
            _this2.setState({
              user: res
            });
          }
        });
      } else {
        this.authenticate();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.serverRequest();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "container"
      }, React.createElement(FormContainer, {
        user: this.state.user
      }));
    }
  }]);

  return Apply;
}(React.Component);

ReactDOM.render(React.createElement(Apply, null), document.getElementById('apply'));