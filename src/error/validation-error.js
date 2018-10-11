'use strict';

module.exports = class ValidationError extends Error {
  constructor(errors) {
    super(`Data validation error`);
    this.errors = errors;
    this.code = 400;
  }
};
