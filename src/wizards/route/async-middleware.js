'use strict';

const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch(next);


module.exports = asyncMiddleware;
