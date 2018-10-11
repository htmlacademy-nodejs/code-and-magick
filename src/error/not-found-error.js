module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.code = 404;
  }
};
