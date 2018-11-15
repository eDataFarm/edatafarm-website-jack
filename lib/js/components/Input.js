"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Input = function Input(props) {
  //console.log(props.value);
  return React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    for: props.name,
    className: "form-label"
  }, props.title), React.createElement("input", _extends({
    className: "form-control",
    id: props.name,
    name: props.name,
    type: props.inputType,
    value: props.value,
    onChange: props.handleChange,
    placeholder: props.placeholder
  }, props)));
};