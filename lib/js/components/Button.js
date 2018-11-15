"use strict";

var Button = function Button(props) {
  return React.createElement("button", {
    style: props.style,
    className: props.type == 'primary' ? 'btn btn-primary' : 'btn btn-secondary',
    onClick: props.action
  }, props.title);
};