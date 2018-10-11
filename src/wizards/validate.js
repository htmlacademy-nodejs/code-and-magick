'use strict';

const ValidationError = require(`../error/validation-error`);

const validate = (data) => {
  const errors = [];
  if (!data.name) {
    errors.push(`Field name "name" is required!`);
  }
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
  return data;
};

module.exports = validate;
