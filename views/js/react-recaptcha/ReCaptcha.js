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

var propTypes = {
  className: PropTypes.string,
  onloadCallbackName: PropTypes.string,
  elementID: PropTypes.string,
  onloadCallback: PropTypes.func,
  verifyCallback: PropTypes.func,
  expiredCallback: PropTypes.func,
  render: PropTypes.string,
  sitekey: PropTypes.string,
  theme: PropTypes.string,
  type: PropTypes.string,
  verifyCallbackName: PropTypes.string,
  expiredCallbackName: PropTypes.string,
  size: PropTypes.string,
  tabindex: PropTypes.string,
  hl: PropTypes.string,
  badge: PropTypes.string
};
var defaultProps = {
  elementID: 'g-recaptcha',
  onloadCallback: undefined,
  onloadCallbackName: 'onloadCallback',
  verifyCallback: undefined,
  verifyCallbackName: 'verifyCallback',
  expiredCallback: undefined,
  expiredCallbackName: 'expiredCallback',
  render: 'onload',
  theme: 'light',
  type: 'image',
  size: 'normal',
  tabindex: '0',
  hl: 'en',
  badge: 'bottomright'
};

var isReady = function isReady() {
  return typeof window !== 'undefined' && typeof window.grecaptcha !== 'undefined';
};

var readyCheck;

var ReCaptcha =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ReCaptcha, _React$Component);

  function ReCaptcha(props) {
    var _this;

    _classCallCheck(this, ReCaptcha);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReCaptcha).call(this, props));
    _this._renderGrecaptcha = _this._renderGrecaptcha.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.reset = _this.reset.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.execute = _this.execute.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      ready: isReady(),
      widget: null
    };

    if (!_this.state.ready) {
      readyCheck = setInterval(_this._updateReadyState.bind(_assertThisInitialized(_assertThisInitialized(_this))), 1000);
    }

    return _this;
  }

  _createClass(ReCaptcha, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!!this.state.ready) {
        this._renderGrecaptcha();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props = this.props,
          render = _this$props.render,
          onloadCallback = _this$props.onloadCallback;

      if (render === 'explicit' && onloadCallback && this.state.ready && !prevState.ready) {
        this._renderGrecaptcha();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearInterval(readyCheck);
    }
  }, {
    key: "reset",
    value: function reset() {
      var _this$state = this.state,
          ready = _this$state.ready,
          widget = _this$state.widget;

      if (ready && widget !== null) {
        grecaptcha.reset(widget);
      }
    }
  }, {
    key: "execute",
    value: function execute() {
      var _this$state2 = this.state,
          ready = _this$state2.ready,
          widget = _this$state2.widget;

      if (ready && widget !== null) {
        grecaptcha.execute(widget);
      }
    }
  }, {
    key: "_updateReadyState",
    value: function _updateReadyState() {
      if (isReady()) {
        this.setState({
          ready: true
        });
        clearInterval(readyCheck);
      }
    }
  }, {
    key: "_renderGrecaptcha",
    value: function _renderGrecaptcha() {
      this.state.widget = grecaptcha.render(this.props.elementID, {
        sitekey: this.props.sitekey,
        callback: this.props.verifyCallback ? this.props.verifyCallback : undefined,
        theme: this.props.theme,
        type: this.props.type,
        size: this.props.size,
        tabindex: this.props.tabindex,
        hl: this.props.hl,
        badge: this.props.badge,
        'expired-callback': this.props.expiredCallback ? this.props.expiredCallback : undefined
      });

      if (this.props.onloadCallback) {
        this.props.onloadCallback();
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.render === 'explicit' && this.props.onloadCallback) {
        return React.createElement("div", {
          id: this.props.elementID,
          "data-onloadcallbackname": this.props.onloadCallbackName,
          "data-verifycallbackname": this.props.verifyCallbackName
        });
      } else {
        return React.createElement("div", {
          id: this.props.elementID,
          className: "g-recaptcha",
          "data-sitekey": this.props.sitekey,
          "data-theme": this.props.theme,
          "data-type": this.props.type,
          "data-size": this.props.size,
          "data-badge": this.props.badge,
          "data-tabindex": this.props.tabindex
        });
      }
    }
  }]);

  return ReCaptcha;
}(React.Component);

ReCaptcha.propTypes = propTypes;
ReCaptcha.defaultProps = defaultProps;