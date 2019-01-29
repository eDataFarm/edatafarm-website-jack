"use strict";

var _react = _interopRequireDefault(require("react"));

var _ReCaptcha = _interopRequireDefault(require("./ReCaptcha"));

var _loadReCaptcha = _interopRequireDefault(require("./loadReCaptcha"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  ReCaptcha: _ReCaptcha.default,
  loadReCaptcha: _loadReCaptcha.default
};