import React, { Component } from 'react';

const renderOptions = (options) => {
  return options.map((option,index) => {
    if (index === 0) {
      return <option defaultValue key={index}>{option}</option>
    } else {
      return <option key={index}>{option}</option>
    }
  })
};

const renderSelect = ({ input, label, type, meta: { touched, error, invalid, warning }, options }) => (
  <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
    <label  className="control-label">{label}</label>
    <div>
      <select {...input} className="form-control">
        {renderOptions(options)}
      </select>
      <div className="help-block">
        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  </div>
);

export default renderSelect;