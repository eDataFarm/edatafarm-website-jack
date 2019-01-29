"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var loadReCaptcha = function loadReCaptcha() {
  var script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = "https://www.google.com/recaptcha/api.js";
  document.body.appendChild(script);
};

var _default = loadReCaptcha;
exports.default = _default;