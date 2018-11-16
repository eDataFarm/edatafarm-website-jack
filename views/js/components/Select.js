"use strict";

var Select = function Select(props) {
  return React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    for: props.name
  }, " ", props.title, " "), React.createElement("select", {
    id: props.name,
    name: props.name,
    value: props.value,
    onChange: props.handleChange,
    className: "form-control"
  }, React.createElement("option", {
    value: "",
    disabled: true
  }, props.placeholder), props.options.map(function (option) {
    return React.createElement("option", {
      key: option,
      value: option,
      label: option
    }, option);
  })));
};