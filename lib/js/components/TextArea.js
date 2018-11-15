"use strict";

var TextArea = function TextArea(props) {
  return React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    className: "form-label"
  }, props.title), React.createElement("textarea", {
    className: "form-control",
    name: props.name,
    rows: props.rows,
    cols: props.cols,
    value: props.value,
    onChange: props.handleChange,
    placeholder: props.placeholder
  }));
};