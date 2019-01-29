"use strict";

var loadReCaptcha = function loadReCaptcha() {
  var script = document.createElement("script");
  script.async = true;
  script.defer = true;
  script.src = "https://www.google.com/recaptcha/api.js?render=6Lc9IY0UAAAAAPJTW6li2-l5ZngZzHmw1ImpqifR";
  document.body.appendChild(script);
};