"use strict";

var CheckBox = function CheckBox(props) {
  return React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    for: props.name,
    className: "form-label"
  }, props.title), React.createElement("div", {
    className: "checkbox"
  }, props.options.map(function (option) {
    return React.createElement("label", {
      key: option,
      className: "checkbox-inline"
    }, React.createElement("input", {
      id: props.name,
      name: props.name,
      onChange: props.handleChange,
      value: option,
      checked: props.selectedOptions.indexOf(option) > -1,
      type: "checkbox"
    }), " ", option);
  })));
};