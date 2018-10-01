'use strict';

const assert = require(`assert`);
const fs = require(`fs`);
const generateCommand = require(`../src/generate`);

const checkAndDelete = (file, cb) => {
  fs.access(file, (accessError) => {
    if (accessError) {
      return assert.fail(accessError.message);
    }

    return fs.unlink(file, (unlinkError) => {
      if (unlinkError) {
        return assert.fail(unlinkError.message);
      }

      return cb();
    });
  });
};

describe(`Generate JSON command`, function () {
  it(`should fail on non existing folder`, function (done) {
    const tempFileName = `${__dirname}/folder/testfile.json`;
    generateCommand.execute(tempFileName, (err) => {
      if (!err) {
        assert.fail(`Path ${tempFileName} should not be available`);
      }

      done();
    });
  });

  it(`should create new file`, function (done) {
    const tempFileName = `${__dirname}/testfile.json`;
    generateCommand.execute(tempFileName, (err) => {
      if (err) {
        return assert.fail(err.message);
      }

      return checkAndDelete(tempFileName, done);
    });
  });
});
