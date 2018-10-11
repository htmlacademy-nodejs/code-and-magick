'use strict';

module.exports = class IllegalArgumentError extends Error {
  constructor(message) {
    super(message);
    this.code = 400;
  }
};
