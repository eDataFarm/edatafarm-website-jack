"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AUTH0_CLIENT_ID = "kNXPBJIHPZnzOTgG3h1wOydoGF0Tjto3";
var AUTH0_DOMAIN = "edatafarm.auth0.com";
var AUTH0_CALLBACK_URL = location.href;
var AUTH0_API_AUDIENCE = "http://www.edatafarm.com";

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
  }

  _createClass(App, [{
    key: "parseHash",
    value: function parseHash() {
      this.auth0 = new auth0.WebAuth({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID
      });
      this.auth0.parseHash(window.location.hash, function (err, authResult) {
        if (err) {
          return console.log(err);
        }

        if (authResult !== null && authResult.accessToken !== null && authResult.idToken !== null) {
          localStorage.setItem("access_token", authResult.accessToken);
          localStorage.setItem("id_token", authResult.idToken);
          localStorage.setItem("profile", JSON.stringify(authResult.idTokenPayload));
          localStorage.setItem("email", authResult.idTokenPayload.name);
          window.location = window.location.href.substr(0, window.location.href.indexOf("#"));
        }
      });
    }
  }, {
    key: "setup",
    value: function setup() {
      $.ajaxSetup({
        beforeSend: function beforeSend(r) {
          if (localStorage.getItem("access_token")) {
            r.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
          }
        }
      });
    }
  }, {
    key: "setState",
    value: function setState() {
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
      this.parseHash();
      this.setState();
    }
  }, {
    key: "render",
    value: function render() {
      if (this.loggedIn) {
        return React.createElement(LoggedIn, null);
      }

      return React.createElement(Home, null);
    }
  }]);

  return App;
}(React.Component);

var Home =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Home, _React$Component2);

  function Home(props) {
    var _this;

    _classCallCheck(this, Home);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Home).call(this, props));
    _this.authenticate = _this.authenticate.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Home, [{
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
    key: "render",
    value: function render() {
      return React.createElement("a", {
        onClick: this.authenticate,
        className: "btn btn-primary btn-lg btn-login btn-block"
      }, React.createElement("span", null, "Sign Up ", React.createElement("i", {
        className: "la la-arrow-right"
      })));
    }
  }]);

  return Home;
}(React.Component);

var LoggedIn =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(LoggedIn, _React$Component3);

  function LoggedIn(props) {
    var _this2;

    _classCallCheck(this, LoggedIn);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(LoggedIn).call(this, props));
    _this2.state = {
      users: []
    };
    _this2.serverRequest = _this2.serverRequest.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    _this2.logout = _this2.logout.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    return _this2;
  }

  _createClass(LoggedIn, [{
    key: "logout",
    value: function logout() {
      localStorage.removeItem("id_token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("profile");
      location.reload();
    }
  }, {
    key: "serverRequest",
    value: function serverRequest() {
      var _this3 = this;

      $.get("../api/v1/users", function (res) {
        _this3.setState({
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
      return React.createElement("a", {
        onClick: this.logout
      }, "Log out");
    }
  }]);

  return LoggedIn;
}(React.Component); // Mount all of the instances of the component


Array.from(document.querySelectorAll('.app')).forEach(function (inp) {
  ReactDOM.render(React.createElement(App, null), inp);
});